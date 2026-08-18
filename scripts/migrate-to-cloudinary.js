/**
 * Cloudinary Migration Script
 * Finds every MongoDB document with a base64 image, uploads it to Cloudinary,
 * and replaces the field with the CDN URL.
 *
 * RUN FROM the backend-fix folder:
 *   node scripts/migrate-to-cloudinary.js
 *
 * REQUIRES these vars in backend-fix/.env:
 *   CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 *   MONGODB_URI=...
 *
 * Safe to re-run — already-migrated Cloudinary URLs are skipped automatically.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Event      = require('../models/Event');
const ExCom      = require('../models/ExCom');
const Gallery    = require('../models/Gallery');
const Partner    = require('../models/Partner');
const Member     = require('../models/Member');
const WebsiteTeam = require('../models/WebsiteTeam');
const Committee  = require('../models/Committee');
const User       = require('../models/User');

// [Model, fieldName, cloudinary folder]
const TARGETS = [
  [Event,       'image',  'ieee-must/events'],
  [ExCom,       'photo',  'ieee-must/excom'],
  [Gallery,     'src',    'ieee-must/gallery'],
  [Partner,     'logo',   'ieee-must/partners'],
  [Member,      'photo',  'ieee-must/members'],
  [WebsiteTeam, 'photo',  'ieee-must/website-team'],
  [Committee,   'image',  'ieee-must/committees'],
  [User,        'avatar', 'ieee-must/avatars'],
];

const isBase64 = (v) => typeof v === 'string' && v.startsWith('data:image/');

async function migrateCollection(Model, field, folder) {
  const docs = await Model.find({ [field]: { $regex: '^data:image/' } });
  if (docs.length === 0) {
    console.log(`  ${Model.modelName}.${field} — nothing to migrate`);
    return { migrated: 0, failed: 0 };
  }

  console.log(`\n  ${Model.modelName}.${field} — ${docs.length} records to migrate`);
  let migrated = 0, failed = 0;

  for (const doc of docs) {
    if (!isBase64(doc[field])) continue;
    try {
      const result = await cloudinary.uploader.upload(doc[field], {
        folder,
        resource_type: 'image',
      });
      await Model.findByIdAndUpdate(doc._id, { [field]: result.secure_url });
      console.log(`    ✓ ${doc._id}`);
      migrated++;
    } catch (err) {
      console.error(`    ✗ ${doc._id}: ${err.message}`);
      failed++;
    }
  }

  return { migrated, failed };
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.MONGODB_URI) {
    console.error('ERROR: Missing CLOUDINARY_CLOUD_NAME or MONGODB_URI in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.\n');

  let totalMigrated = 0, totalFailed = 0;

  for (const [Model, field, folder] of TARGETS) {
    const { migrated, failed } = await migrateCollection(Model, field, folder);
    totalMigrated += migrated;
    totalFailed += failed;
  }

  console.log('\n── Done ──────────────────────────────');
  console.log(`  Migrated : ${totalMigrated}`);
  console.log(`  Failed   : ${totalFailed}`);
  if (totalFailed > 0) console.log('  Re-run the script to retry failed records.');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

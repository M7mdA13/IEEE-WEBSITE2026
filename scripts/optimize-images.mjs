/**
 * One-time image optimization script.
 * Run with: node scripts/optimize-images.mjs
 *
 * - Converts ExCom PNGs to WebP (80% smaller)
 * - Resizes & converts IEEE-MUST.png to a 400px WebP for display use
 * - Compresses partner PNGs that are >100 KB
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images');

const tasks = [
  // ExCom portraits — displayed at ~280px wide, PNGs are 160-180 KB each
  { src: 'Mennatallah copy.png', dest: 'Mennatallah copy.webp', width: 400 },
  { src: 'moustafa copy.png',    dest: 'moustafa copy.webp',    width: 400 },
  { src: 'karima copy.png',      dest: 'karima copy.webp',      width: 400 },
  { src: 'alsonbaty copy.png',   dest: 'alsonbaty copy.webp',   width: 400 },
  { src: 'shahd copy.png',       dest: 'shahd copy.webp',       width: 400 },

  // Hero / Navbar logo — displayed at max 350px but PNG is 4096×4096 / 1 MB
  { src: 'IEEE-MUST.png', dest: 'IEEE-MUST.webp', width: 400 },

  // Large partner images
  { src: 'partner 8.png',  dest: 'partner 8.webp',  width: 400 },
  { src: 'partner 1.png',  dest: 'partner 1.webp',  width: 400 },
  { src: 'partner 7.png',  dest: 'partner 7.webp',  width: 400 },
  { src: 'EMBS.png',       dest: 'EMBS.webp',       width: 300 },
  { src: 'LOGO IEEE Blue.png',  dest: 'LOGO IEEE Blue.webp',  width: 300 },
  { src: 'LOGO IEEE White.png', dest: 'LOGO IEEE White.webp', width: 300 },
  { src: 'logo-ieee-blue.png',  dest: 'logo-ieee-blue.webp',  width: 300 },
  { src: 'logo-ieee-white.png', dest: 'logo-ieee-white.webp', width: 300 },

  // Group photos used in PhotoCatalogue
  { src: 'group pic 1.jpg', dest: 'group pic 1.webp', width: 800 },
  { src: 'group pic 2.jpg', dest: 'group pic 2.webp', width: 800 },
  { src: 'group pic 3.jpg', dest: 'group pic 3.webp', width: 800 },
];

let totalSaved = 0;

for (const task of tasks) {
  const srcPath  = path.join(imgDir, task.src);
  const destPath = path.join(imgDir, task.dest);

  try {
    const before = (await stat(srcPath)).size;
    await sharp(srcPath)
      .resize({ width: task.width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destPath);
    const after = (await stat(destPath)).size;
    const saved = before - after;
    totalSaved += saved;
    console.log(`✓ ${task.src} → ${task.dest}  (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB, saved ${(saved/1024).toFixed(0)}KB)`);
  } catch (e) {
    console.warn(`✗ ${task.src}: ${e.message}`);
  }
}

console.log(`\nTotal saved: ${(totalSaved / 1024).toFixed(0)} KB`);

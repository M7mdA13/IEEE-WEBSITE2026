const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee', required: true },
    roleType: {
      type: String,
      required: true,
      enum: ['head', 'vice_head', 'featured'],
    },
    role: { type: String, trim: true }, // Display label e.g. "AI Researcher", "CTF Player"
    bio: { type: String, trim: true },
    photo: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    stars: { type: Number, min: 1, max: 5 }, // for featured members
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

memberSchema.index({ committee: 1, roleType: 1, order: 1 });

module.exports = mongoose.model('Member', memberSchema);

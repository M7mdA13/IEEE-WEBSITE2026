const mongoose = require('mongoose');

const websiteTeamSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    role:     { type: String, required: true, trim: true },
    tier:     { type: Number, required: true, enum: [1, 2, 3] }, // 1=Leadership, 2=Design, 3=Engineering
    photo:    { type: String, trim: true },
    email:    { type: String, trim: true, lowercase: true },
    linkedin: { type: String, trim: true },
    github:   { type: String, trim: true },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

websiteTeamSchema.index({ tier: 1, order: 1 });

module.exports = mongoose.model('WebsiteTeam', websiteTeamSchema);

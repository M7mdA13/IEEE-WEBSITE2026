const mongoose = require('mongoose');

const excomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }, // e.g. "Chairperson", "Vice Chairperson"
    department: { type: String, trim: true },
    bio: { type: String, trim: true },
    photo: { type: String, trim: true }, // URL or relative path
    email: { type: String, trim: true, lowercase: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

excomSchema.index({ order: 1 });

module.exports = mongoose.model('ExCom', excomSchema);

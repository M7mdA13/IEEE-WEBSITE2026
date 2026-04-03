const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true }, // e.g. "Sponsor", "Academic", "Industry"
    website: { type: String, trim: true },
    logo: { type: String, trim: true }, // URL or path
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', partnerSchema);

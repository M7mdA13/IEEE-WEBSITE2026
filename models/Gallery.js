const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

gallerySchema.index({ order: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);

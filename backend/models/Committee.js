const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  { title: String, desc: String },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  { title: String, desc: String },
  { _id: false }
);

const committeeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['technical', 'non-technical'],
    },
    icon: { type: String, trim: true },   // Font Awesome class e.g. "fa-brain"
    image: { type: String, trim: true },  // URL or path
    tagline: { type: String, trim: true },
    shortDesc: { type: String, trim: true },
    goals: { type: [goalSchema], default: [] },
    roles: { type: [String], default: [] },
    activities: { type: [activitySchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

committeeSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Committee', committeeSchema);

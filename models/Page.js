const mongoose = require('mongoose');

// CMS store for dynamic site content (stats, text snippets, etc.)
// One document per key — e.g. { key: "about_stats", value: { members: 200, events: 50 } }
const pageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    label: { type: String, trim: true }, // human-readable name for dashboard display
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);

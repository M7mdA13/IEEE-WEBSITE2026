const mongoose = require('mongoose');

// Singleton collection — always exactly one document
const recruitmentStatusSchema = new mongoose.Schema(
  {
    isOpen: { type: Boolean, required: true, default: false },
    message: { type: String, trim: true, default: 'Recruitment is currently closed.' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecruitmentStatus', recruitmentStatusSchema);

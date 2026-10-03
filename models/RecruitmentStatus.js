const mongoose = require('mongoose');

// Singleton collection — always exactly one document
const recruitmentStatusSchema = new mongoose.Schema(
  {
    isOpen: { type: Boolean, required: true, default: false },
    // Optional override text. Blank = the Membership page picks its own copy for open/closed.
    message: { type: String, trim: true, default: '' },
    // Application form (e.g. Google Forms). Shown as a QR code + button while recruitment is open.
    formLink: { type: String, trim: true, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecruitmentStatus', recruitmentStatusSchema);

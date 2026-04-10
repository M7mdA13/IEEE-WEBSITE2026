const MailingList = require('../models/MailingList');

// POST /api/public/mailing-list  — subscribe
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await MailingList.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.json({ success: true, message: "You're already on the list!" });
    }

    await MailingList.create({ email });
    res.status(201).json({ success: true, message: "You're on the list! We'll notify you when recruitment opens." });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/mailing-list
exports.getAll = async (req, res, next) => {
  try {
    const subscribers = await MailingList.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/mailing-list/:id
exports.remove = async (req, res, next) => {
  try {
    await MailingList.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Removed from list' });
  } catch (err) {
    next(err);
  }
};

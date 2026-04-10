const WebsiteTeam = require('../models/WebsiteTeam');

// GET /api/public/website-team
exports.getAll = async (req, res, next) => {
  try {
    const members = await WebsiteTeam.find({ isActive: true }).sort({ tier: 1, order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/website-team  (includes inactive)
exports.getAdminAll = async (req, res, next) => {
  try {
    const members = await WebsiteTeam.find().sort({ tier: 1, order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/website-team/:id
exports.getOne = async (req, res, next) => {
  try {
    const member = await WebsiteTeam.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Website team member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/website-team
exports.create = async (req, res, next) => {
  try {
    const member = await WebsiteTeam.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/website-team/:id
exports.update = async (req, res, next) => {
  try {
    const member = await WebsiteTeam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Website team member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/website-team/:id
exports.remove = async (req, res, next) => {
  try {
    const member = await WebsiteTeam.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Website team member not found' });
    }
    res.json({ success: true, message: 'Website team member deleted' });
  } catch (err) {
    next(err);
  }
};

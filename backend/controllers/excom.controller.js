const ExCom = require('../models/ExCom');

// GET /api/public/excom
exports.getAll = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    const members = await ExCom.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/excom  (includes inactive)
exports.getAdminAll = async (req, res, next) => {
  try {
    const members = await ExCom.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/excom/:id
exports.getOne = async (req, res, next) => {
  try {
    const member = await ExCom.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'ExCom member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/excom
exports.create = async (req, res, next) => {
  try {
    const member = await ExCom.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/excom/:id
exports.update = async (req, res, next) => {
  try {
    const member = await ExCom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'ExCom member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/excom/:id
exports.remove = async (req, res, next) => {
  try {
    const member = await ExCom.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'ExCom member not found' });
    }
    res.json({ success: true, message: 'ExCom member deleted' });
  } catch (err) {
    next(err);
  }
};

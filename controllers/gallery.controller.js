const Gallery = require('../models/Gallery');

// GET /api/public/gallery
exports.getAllPublic = async (req, res, next) => {
  try {
    const photos = await Gallery.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/gallery
exports.getAllAdmin = async (req, res, next) => {
  try {
    const photos = await Gallery.find().sort({ order: 1 });
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/gallery
exports.create = async (req, res, next) => {
  try {
    const photo = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: photo });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/gallery/:id
exports.update = async (req, res, next) => {
  try {
    const photo = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, data: photo });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/gallery/:id
exports.remove = async (req, res, next) => {
  try {
    const photo = await Gallery.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.json({ success: true, message: 'Photo deleted' });
  } catch (err) {
    next(err);
  }
};

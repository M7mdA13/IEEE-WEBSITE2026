const Committee = require('../models/Committee');

// GET /api/public/committees?category=technical
exports.getAll = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    // Public listing — omit heavy fields (goals, roles, activities)
    const committees = await Committee.find(filter)
      .select('-goals -roles -activities')
      .sort({ order: 1, name: 1 });

    res.json({ success: true, data: committees });
  } catch (err) {
    next(err);
  }
};

// GET /api/public/committees/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const committee = await Committee.findOne({ slug: req.params.slug, isActive: true });
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee not found' });
    }
    res.json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/committees  (all, including inactive)
exports.getAdminAll = async (req, res, next) => {
  try {
    const committees = await Committee.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: committees });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/committees/:id
exports.getOne = async (req, res, next) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee not found' });
    }
    res.json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/committees
exports.create = async (req, res, next) => {
  try {
    const committee = await Committee.create(req.body);
    res.status(201).json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/committees/:id
exports.update = async (req, res, next) => {
  try {
    const committee = await Committee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee not found' });
    }
    res.json({ success: true, data: committee });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/committees/:id
exports.remove = async (req, res, next) => {
  try {
    const committee = await Committee.findByIdAndDelete(req.params.id);
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee not found' });
    }
    res.json({ success: true, message: 'Committee deleted' });
  } catch (err) {
    next(err);
  }
};

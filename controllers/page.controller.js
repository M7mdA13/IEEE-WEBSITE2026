const Page = require('../models/Page');

// GET /api/public/pages/:key
exports.getByKey = async (req, res, next) => {
  try {
    const page = await Page.findOne({ key: req.params.key });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page key not found' });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/pages  (all keys)
exports.getAll = async (req, res, next) => {
  try {
    const pages = await Page.find().sort({ key: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/pages/:key  (upsert)
exports.upsert = async (req, res, next) => {
  try {
    const { value, label } = req.body;
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'value is required' });
    }

    const page = await Page.findOneAndUpdate(
      { key: req.params.key },
      { value, ...(label && { label }) },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/pages/:key
exports.remove = async (req, res, next) => {
  try {
    const page = await Page.findOneAndDelete({ key: req.params.key });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page key not found' });
    }
    res.json({ success: true, message: 'Page key deleted' });
  } catch (err) {
    next(err);
  }
};

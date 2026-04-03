const Partner = require('../models/Partner');

exports.getAll = async (req, res, next) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
};

exports.getAdminAll = async (req, res, next) => {
  try {
    const partners = await Partner.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const partner = await Partner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, message: 'Partner deleted' });
  } catch (err) { next(err); }
};

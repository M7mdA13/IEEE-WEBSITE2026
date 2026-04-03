const Event = require('../models/Event');

// GET /api/public/events?status=upcoming|completed
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      // Default: return upcoming and completed (not planning/cancelled)
      filter.status = { $in: ['upcoming', 'completed'] };
    }

    const events = await Event.find(filter).sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

// GET /api/public/events/:id
exports.getOne = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/events  (all statuses)
exports.getAdminAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const events = await Event.find(filter).sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/events
exports.create = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/events/:id
exports.update = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/events/:id
exports.remove = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

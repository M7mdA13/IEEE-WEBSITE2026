const Member = require('../models/Member');
const Committee = require('../models/Committee');

// GET /api/public/members?committee=<slug>&type=head|vice_head|featured
exports.getAll = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    if (req.query.type) filter.roleType = req.query.type;

    if (req.query.committee) {
      const committee = await Committee.findOne({ slug: req.query.committee });
      if (!committee) {
        return res.status(404).json({ success: false, message: 'Committee not found' });
      }
      filter.committee = committee._id;
    }

    const members = await Member.find(filter)
      .populate('committee', 'slug name')
      .sort({ order: 1, name: 1 });

    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/members  (all, including inactive)
exports.getAdminAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.committee) filter.committee = req.query.committee;
    if (req.query.type) filter.roleType = req.query.type;

    const members = await Member.find(filter)
      .populate('committee', 'slug name')
      .sort({ order: 1 });

    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/members/:id
exports.getOne = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).populate('committee', 'slug name');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/members
exports.create = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    await member.populate('committee', 'slug name');
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/members/:id
exports.update = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('committee', 'slug name');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/members/:id
exports.remove = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    next(err);
  }
};

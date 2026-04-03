const RecruitmentStatus = require('../models/RecruitmentStatus');

const getOrCreate = async () => {
  let status = await RecruitmentStatus.findOne();
  if (!status) {
    status = await RecruitmentStatus.create({});
  }
  return status;
};

// GET /api/public/recruitment
exports.getStatus = async (req, res, next) => {
  try {
    const status = await getOrCreate();
    res.json({ success: true, data: { isOpen: status.isOpen, message: status.message } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/recruitment
exports.getAdminStatus = async (req, res, next) => {
  try {
    const status = await getOrCreate();
    res.json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/recruitment
exports.updateStatus = async (req, res, next) => {
  try {
    const { isOpen, message } = req.body;
    const status = await getOrCreate();

    if (typeof isOpen === 'boolean') status.isOpen = isOpen;
    if (message !== undefined) status.message = message;
    status.updatedBy = req.user.id;

    await status.save();
    res.json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
};

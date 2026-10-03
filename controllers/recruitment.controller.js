const RecruitmentStatus = require('../models/RecruitmentStatus');

// Older documents were created with one of these as the message (model default /
// seed script). Left in place they'd show under "Recruitment is now open!", so
// treat them as blank.
const LEGACY_DEFAULT_MESSAGES = new Set([
  'Recruitment is currently closed.',
  'Recruitment is currently closed. Stay tuned for announcements.',
]);

const getOrCreate = async () => {
  let status = await RecruitmentStatus.findOne();
  if (!status) {
    status = await RecruitmentStatus.create({});
  }
  return status;
};

const toResponse = (status) => ({
  isOpen: status.isOpen,
  message: LEGACY_DEFAULT_MESSAGES.has(status.message) ? '' : status.message || '',
  formLink: status.formLink || '',
  updatedAt: status.updatedAt,
});

// Same rules as the dashboard's normalizeUrl(): add https:// to bare domains,
// refuse other schemes (javascript:, data:, ...). Returns null when invalid.
const normalizeLink = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const url = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? null : `https://${trimmed}`;
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    return hostname.includes('.') ? url : null;
  } catch {
    return null;
  }
};

// GET /api/public/recruitment
exports.getStatus = async (req, res, next) => {
  try {
    const status = await getOrCreate();
    const { isOpen, message, formLink } = toResponse(status);
    res.json({ success: true, data: { isOpen, message, formLink } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/recruitment
exports.getAdminStatus = async (req, res, next) => {
  try {
    const status = await getOrCreate();
    res.json({ success: true, data: toResponse(status) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/recruitment
exports.updateStatus = async (req, res, next) => {
  try {
    const { isOpen, message, formLink } = req.body;
    const status = await getOrCreate();

    if (typeof isOpen === 'boolean') status.isOpen = isOpen;
    if (message !== undefined) status.message = message;
    if (formLink !== undefined) {
      const link = normalizeLink(formLink);
      if (link === null) {
        return res.status(400).json({ success: false, message: 'Form link must be a valid web address' });
      }
      status.formLink = link;
    }
    status.updatedBy = req.user.id;

    await status.save();
    res.json({ success: true, data: toResponse(status) });
  } catch (err) {
    next(err);
  }
};

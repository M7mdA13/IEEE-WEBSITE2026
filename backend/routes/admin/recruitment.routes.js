const router = require('express').Router();
const { getAdminStatus, updateStatus } = require('../../controllers/recruitment.controller');

router.get('/', getAdminStatus);
router.put('/', updateStatus);

module.exports = router;

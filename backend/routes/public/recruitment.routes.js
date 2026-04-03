const router = require('express').Router();
const { getStatus } = require('../../controllers/recruitment.controller');

router.get('/', getStatus);

module.exports = router;

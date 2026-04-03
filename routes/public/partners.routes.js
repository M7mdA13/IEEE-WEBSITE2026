const router = require('express').Router();
const { getAll } = require('../../controllers/partner.controller');

router.get('/', getAll);

module.exports = router;

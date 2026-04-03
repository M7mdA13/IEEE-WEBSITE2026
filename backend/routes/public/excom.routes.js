const router = require('express').Router();
const { getAll } = require('../../controllers/excom.controller');

router.get('/', getAll);

module.exports = router;

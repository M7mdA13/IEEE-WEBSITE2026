const router = require('express').Router();
const { getByKey } = require('../../controllers/page.controller');

router.get('/:key', getByKey);

module.exports = router;

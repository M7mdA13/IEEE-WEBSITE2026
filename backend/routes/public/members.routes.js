const router = require('express').Router();
const { getAll } = require('../../controllers/member.controller');

router.get('/', getAll);

module.exports = router;

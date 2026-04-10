const router = require('express').Router();
const { getAll } = require('../../controllers/websiteTeam.controller');

router.get('/', getAll);

module.exports = router;

const router = require('express').Router();
const { subscribe } = require('../../controllers/mailingList.controller');

router.post('/', subscribe);

module.exports = router;

const router = require('express').Router();
const { getAll, getBySlug } = require('../../controllers/committee.controller');

router.get('/', getAll);
router.get('/:slug', getBySlug);

module.exports = router;

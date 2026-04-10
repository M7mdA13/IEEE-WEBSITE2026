const router = require('express').Router();
const { getAll, remove } = require('../../controllers/mailingList.controller');

router.get('/', getAll);
router.delete('/:id', remove);

module.exports = router;

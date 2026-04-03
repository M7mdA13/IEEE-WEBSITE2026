const router = require('express').Router();
const { getAll, upsert, remove } = require('../../controllers/page.controller');

router.get('/', getAll);
router.put('/:key', upsert);
router.delete('/:key', remove);

module.exports = router;

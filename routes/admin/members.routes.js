const router = require('express').Router();
const {
  getAdminAll,
  getOne,
  create,
  update,
  remove,
} = require('../../controllers/member.controller');

router.get('/', getAdminAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;

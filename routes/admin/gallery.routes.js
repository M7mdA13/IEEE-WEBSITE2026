const router = require('express').Router();
const galleryController = require('../../controllers/gallery.controller');

router.get('/', galleryController.getAllAdmin);
router.post('/', galleryController.create);
router.put('/:id', galleryController.update);
router.delete('/:id', galleryController.remove);

module.exports = router;

const express = require('express');
const menuController = require('../Controllers/menuController');
const upload = require('../Services/UploadImage');

const router = express.Router();

router.get('/', menuController.getMenu)

router.get('/:id', menuController.getOneMenu)

router.post('/', menuController.uploadMenu)

router.post('/uploadImage', upload, menuController.uploadImage)

router.delete('/:id', menuController.deleteMenu)


module.exports = router;
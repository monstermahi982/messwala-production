const express = require('express');
const menuController = require('../Controllers/menuController');
const upload = require('../Services/UploadImage');
const auth = require('../Middlewares/auth');
const adminToken = require('../Middlewares/adminToken');

const router = express.Router();

router.get('/', adminToken, menuController.getMenu)

router.get('/:id', auth, menuController.getOneMenu)

router.post('/', auth, menuController.uploadMenu)

router.post('/uploadImage', auth, upload, menuController.uploadImage)

router.delete('/:id', menuController.deleteMenu)


module.exports = router;
const express = require('express');
const menuController = require('../Controllers/menuController');
const upload = require('../Services/UploadImage');
const auth = require('../Middlewares/auth');
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.get('/', ipLimiting, adminToken, menuController.getMenu)

router.get('/:id', ipLimiting, auth, menuController.getOneMenu)

router.post('/', ipLimiting, auth, menuController.uploadMenu)

router.post('/uploadImage', ipLimiting, auth, upload, menuController.uploadImage)

router.delete('/:id', ipLimiting, menuController.deleteMenu)


module.exports = router;
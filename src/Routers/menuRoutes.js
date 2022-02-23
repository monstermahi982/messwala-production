const express = require('express');
const menuController = require('../Controllers/menuController');
const upload = require('../Services/UploadImage');
const ipLimiting = require('../Middlewares/ipLimiting');
const ownerToken = require('../Middlewares/ownerToken');

const router = express.Router();

router.post('/', ipLimiting, ownerToken, menuController.uploadMenu)

router.post('/uploadImage', ipLimiting, ownerToken, upload, menuController.uploadImage)

module.exports = router;
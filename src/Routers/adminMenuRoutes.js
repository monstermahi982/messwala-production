const express = require('express');
const adminMenuController = require('../Controllers/adminMenuController');
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');
const upload = require('../Services/UploadImage');

const router = express.Router();

router.get('/', ipLimiting, adminToken, adminMenuController.getMenu)

router.post('/', ipLimiting, adminToken, adminMenuController.uploadMenu)

router.post('/uploadImage', ipLimiting, adminToken, upload, adminMenuController.uploadImage)

router.delete('/:id', ipLimiting, adminToken, adminMenuController.deleteMenu)

module.exports = router;
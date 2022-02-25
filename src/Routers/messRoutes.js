const express = require('express');
const messController = require('../Controllers/messController');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');
const ownerToken = require('../Middlewares/ownerToken');
const upload = require('../Services/UploadImage');

const router = express.Router();

router.get('/', ipLimiting, messController.getAllMess)

// router.get('/:id', auth, messController.getMessMenu)

router.get('/:id', ipLimiting, messController.getMessMenu)

router.get('/info/:id', ipLimiting, ownerToken, messController.messDeatils)

router.put('/info/:id', ipLimiting, ownerToken, messController.updateInfo)

router.put('/poster/:id', ipLimiting, ownerToken, upload, messController.updatePoster)

router.get('/statics/:id', ipLimiting, ownerToken, messController.ownerStatics)

module.exports = router;
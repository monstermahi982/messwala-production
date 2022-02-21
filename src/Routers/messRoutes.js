const express = require('express');
const messController = require('../Controllers/messController');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');
const upload = require('../Services/UploadImage');

const router = express.Router();

router.get('/', ipLimiting, messController.getAllMess)

// router.get('/:id', auth, messController.getMessMenu)

router.get('/:id', ipLimiting, auth, messController.getMessMenu)

router.get('/info/:id', ipLimiting, auth, messController.messDeatils)

router.put('/info/:id', ipLimiting, auth, messController.updateInfo)

router.put('/poster/:id', ipLimiting, upload, messController.updatePoster)

router.get('/statics/:id', ipLimiting, messController.ownerStatics)

module.exports = router;
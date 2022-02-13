const express = require('express');
const messController = require('../Controllers/messController');
const auth = require('../Middlewares/auth');
const upload = require('../Services/UploadImage');

const router = express.Router();

router.get('/', messController.getAllMess)

// router.get('/:id', auth, messController.getMessMenu)

router.get('/:id', messController.getMessMenu)

router.get('/info/:id', messController.messDeatils)

router.put('/info/:id', messController.updateInfo)

router.put('/poster/:id', upload, messController.updatePoster)

router.post('/', messController.addMess)

router.get('/statics/:id', messController.ownerStatics)

module.exports = router;
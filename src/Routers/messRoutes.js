const express = require('express');
const messController = require('../Controllers/messController');
const auth = require('../Middlewares/auth');
const upload = require('../Services/UploadImage');

const router = express.Router();

router.get('/', messController.getAllMess)

// router.get('/:id', auth, messController.getMessMenu)

router.get('/:id', auth, messController.getMessMenu)

router.get('/info/:id', auth, messController.messDeatils)

router.put('/info/:id', auth, messController.updateInfo)

router.put('/poster/:id', upload, messController.updatePoster)

router.post('/', auth, messController.addMess)

router.get('/statics/:id', messController.ownerStatics)

module.exports = router;
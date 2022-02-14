const express = require('express');
const adminMessController = require('../Controllers/adminMessController');
const adminToken = require('../Middlewares/adminToken');

const router = express.Router();

router.get('/', adminToken, adminMessController.getAll)

router.post('/', adminToken, adminMessController.addMess)

router.get('/:id', adminToken, adminMessController.getOne)

router.put('/:id', adminToken, adminMessController.updateInfo)

router.put('/owner/:id', adminToken, adminMessController.updateOwner)

router.put('/block/:id', adminToken, adminMessController.blockMess)

router.put('/unblock/:id', adminToken, adminMessController.unblockMess)

router.delete('/:id', adminMessController.deleteMess)

module.exports = router;
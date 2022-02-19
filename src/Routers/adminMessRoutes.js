const express = require('express');
const adminMessController = require('../Controllers/adminMessController');
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.get('/', ipLimiting, adminToken, adminMessController.getAll)

router.post('/', ipLimiting, adminToken, adminMessController.addMess)

router.put('/blockall', ipLimiting, adminToken, adminMessController.blockAllMess)

router.get('/:id', ipLimiting, adminToken, adminMessController.getOne)

router.put('/:id', ipLimiting, adminToken, adminMessController.updateInfo)

router.put('/owner/:id', ipLimiting, adminToken, adminMessController.updateOwner)

router.put('/block/:id', ipLimiting, adminToken, adminMessController.blockMess)

router.put('/unblock/:id', ipLimiting, adminToken, adminMessController.unblockMess)

router.delete('/:id', ipLimiting, adminMessController.deleteMess)

module.exports = router;
const express = require('express');
const adminMessController = require('../Controllers/adminMessController');

const router = express.Router();

router.get('/', adminMessController.getAll)

router.post('/', adminMessController.addMess)

router.get('/:id', adminMessController.getOne)

router.put('/:id', adminMessController.updateInfo)

router.put('/owner/:id', adminMessController.updateOwner)

router.put('/block/:id', adminMessController.blockMess)

router.put('/unblock/:id', adminMessController.unblockMess)

router.delete('/:id', adminMessController.deleteMess)

module.exports = router;
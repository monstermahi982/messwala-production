const express = require('express');
const itemController = require('../Controllers/itemController');
const auth = require('../Middlewares/auth');
const router = express.Router();
const adminToken = require('../Middlewares/adminToken');

router.get('/', auth, itemController.get)

router.post('/', adminToken, itemController.add)

router.delete('/:id', adminToken, itemController.delete)


module.exports = router;
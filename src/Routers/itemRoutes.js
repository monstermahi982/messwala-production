const express = require('express');
const itemController = require('../Controllers/itemController');
const auth = require('../Middlewares/auth');
const router = express.Router();
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');

router.get('/', ipLimiting, auth, itemController.get)

router.post('/', ipLimiting, adminToken, itemController.add)

router.delete('/:id', ipLimiting, adminToken, itemController.delete)


module.exports = router;
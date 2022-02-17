const express = require('express');
const userAuthController = require('../Controllers/userAuthController');
const adminToken = require('../Middlewares/adminToken');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.post('/register', ipLimiting, userAuthController.register)

router.post('/login', ipLimiting, userAuthController.login)

router.get('/', ipLimiting, adminToken, userAuthController.getUsers)

router.delete('/:id', ipLimiting, adminToken, userAuthController.deleteUser)

router.put('/block/:id', ipLimiting, adminToken, userAuthController.blockUser)

router.put('/unblock/:id', ipLimiting, adminToken, userAuthController.unblockUser)

module.exports = router;
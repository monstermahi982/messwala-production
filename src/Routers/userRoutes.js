const express = require('express');
const userAuthController = require('../Controllers/userAuthController');
const adminToken = require('../Middlewares/adminToken');
const auth = require('../Middlewares/auth');

const router = express.Router();

router.post('/register', userAuthController.register)

router.post('/login', userAuthController.login)

router.get('/', adminToken, userAuthController.getUsers)

router.delete('/:id', adminToken, userAuthController.deleteUser)

router.put('/block/:id', adminToken, userAuthController.blockUser)

router.put('/unblock/:id', adminToken, userAuthController.unblockUser)

module.exports = router;
const express = require('express');
const userAuthController = require('../Controllers/userAuthController');
const auth = require('../Middlewares/auth');

const router = express.Router();

router.post('/register', userAuthController.register)

router.post('/login', userAuthController.login)

router.get('/', userAuthController.getUsers)

router.delete('/:id', userAuthController.deleteUser)

router.put('/block/:id', userAuthController.blockUser)

router.put('/unblock/:id', userAuthController.unblockUser)

module.exports = router;
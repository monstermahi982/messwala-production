const express = require('express');
const ownerController = require('../Controllers/ownerController');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.put('/:id', ipLimiting, auth, ownerController.updateOwner)

router.post('/login', ipLimiting, ownerController.login)



module.exports = router;
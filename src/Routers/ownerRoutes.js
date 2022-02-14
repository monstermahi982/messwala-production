const express = require('express');
const ownerController = require('../Controllers/ownerController');
const auth = require('../Middlewares/auth');

const router = express.Router();

router.put('/:id', auth, ownerController.updateOwner)

router.post('/login', ownerController.login)



module.exports = router;
const express = require('express');
const ownerController = require('../Controllers/ownerController');

const router = express.Router();

router.put('/:id', ownerController.updateOwner)

router.post('/login', ownerController.login)



module.exports = router;
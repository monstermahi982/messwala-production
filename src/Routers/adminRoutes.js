const express = require('express');
const adminController = require('../Controllers/adminController');
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.get('/', ipLimiting, adminToken, adminController.getAdmin)

router.post('/', ipLimiting, adminToken, adminController.addAdmin)

router.post('/auth/login', ipLimiting, adminController.loginAdmin)

router.delete('/:id', ipLimiting, adminToken, adminController.deleteAdmin)

module.exports = router;
const express = require('express');
const adminController = require('../Controllers/adminController');
const adminToken = require('../Middlewares/adminToken');

const router = express.Router();

router.get('/', adminToken, adminController.getAdmin)

router.post('/', adminToken, adminController.addAdmin)

router.post('/auth/login', adminController.loginAdmin)

router.delete('/:id', adminToken, adminController.deleteAdmin)

module.exports = router;
const express = require('express');
const adminController = require('../Controllers/adminController');
const adminToken = require('../Middlewares/adminToken');

const router = express.Router();

router.get('/', adminController.getAdmin)

router.post('/', adminController.addAdmin)

router.post('/auth/login', adminController.loginAdmin)

router.delete('/:id', adminController.deleteAdmin)

module.exports = router;
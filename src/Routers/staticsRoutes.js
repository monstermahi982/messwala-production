const express = require('express');
const staticsController = require('../Controllers/staticsController');
const auth = require('../Middlewares/auth');
const adminToken = require('../Middlewares/adminToken');

const router = express.Router();

router.get('/mess/:id', staticsController.owner);

router.get('/today', adminToken, staticsController.todays);

router.get('/users', adminToken, staticsController.totalUser);


module.exports = router;
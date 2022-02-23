const express = require('express');
const staticsController = require('../Controllers/staticsController');
const auth = require('../Middlewares/auth');
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');
const ownerToken = require('../Middlewares/ownerToken');

const router = express.Router();

router.get('/mess/:id', ipLimiting, ownerToken, staticsController.owner);

router.get('/today', ipLimiting, adminToken, staticsController.todays);

router.get('/users', ipLimiting, adminToken, staticsController.totalUser);


module.exports = router;
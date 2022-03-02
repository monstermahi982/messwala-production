const express = require('express');
const referalController = require('../Controllers/referalController');
const adminToken = require('../Middlewares/adminToken');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.get('/', ipLimiting, referalController.getReferalUsers)

router.get('/admin', ipLimiting, adminToken, referalController.getReferalUsersAdmin)

router.delete('/:id', ipLimiting, adminToken, referalController.deleteReferalUser)

router.put('/block/:id', ipLimiting, adminToken, referalController.blockReferalUser)

router.put('/unblock/:id', ipLimiting, adminToken, referalController.unblockReferalUser)

router.put('/redeemed/:id', ipLimiting, adminToken, referalController.redeemedReferalUser)

module.exports = router;
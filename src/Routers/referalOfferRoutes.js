const express = require('express');
const referalOfferController = require('../Controllers/referalOfferController');
const adminToken = require('../Middlewares/adminToken');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.get('/', ipLimiting, referalOfferController.getReferalOffer)

router.get('/admin', ipLimiting, adminToken, referalOfferController.getAllReferalOffer)

router.post('/', ipLimiting, adminToken, referalOfferController.addReferalOffer)

router.put('/views/:id', ipLimiting, referalOfferController.views)

router.put('/likes/:id', ipLimiting, auth, referalOfferController.likes)

router.put('/block/:id', ipLimiting, adminToken, referalOfferController.blockReferalUser)

router.put('/unblock/:id', ipLimiting, adminToken, referalOfferController.unblockReferalUser)

router.delete('/:id', ipLimiting, adminToken, referalOfferController.deleteReferalOffer)

module.exports = router;
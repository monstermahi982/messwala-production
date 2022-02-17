const express = require('express');
const actionController = require('../Controllers/actionController');
const adminToken = require('../Middlewares/adminToken');
const auth = require('../Middlewares/auth');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.get('/', ipLimiting, adminToken, actionController.getActions)

router.post('/like', ipLimiting, auth, actionController.actionLike)

router.post('/dislike', ipLimiting, auth, actionController.actionDislike)

router.delete('/:id', ipLimiting, adminToken, actionController.deleteAction)

module.exports = router;
const express = require('express');
const commentController = require('../Controllers/commentController');
const auth = require('../Middlewares/auth');
const adminToken = require('../Middlewares/adminToken');
const ipLimiting = require('../Middlewares/ipLimiting');

const router = express.Router();

router.post('/', ipLimiting, auth, commentController.addComment)

router.delete('/:id', ipLimiting, adminToken, commentController.deleteComment)

router.get('/', ipLimiting, adminToken, commentController.getComment)

router.get('/:id', ipLimiting, adminToken, commentController.getMessComments)

module.exports = router;
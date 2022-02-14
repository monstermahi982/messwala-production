const express = require('express');
const commentController = require('../Controllers/commentController');
const auth = require('../Middlewares/auth');
const adminToken = require('../Middlewares/adminToken');

const router = express.Router();

router.post('/', auth, commentController.addComment)

router.delete('/:id', adminToken, commentController.deleteComment)

router.get('/', adminToken, commentController.getComment)

router.get('/:id', adminToken, commentController.getMessComments)

module.exports = router;
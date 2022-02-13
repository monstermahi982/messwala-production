const express = require('express');
const commentController = require('../Controllers/commentController');
const auth = require('../Middlewares/auth');

const router = express.Router();

router.post('/', auth, commentController.addComment)

router.delete('/:id', commentController.deleteComment)

router.get('/', commentController.getComment)

router.get('/:id', commentController.getMessComments)

module.exports = router;
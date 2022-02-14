const express = require('express');
const actionController = require('../Controllers/actionController');
const adminToken = require('../Middlewares/adminToken');
const auth = require('../Middlewares/auth');

const router = express.Router();

router.get('/', adminToken, actionController.getActions)

router.post('/like', auth, actionController.actionLike)

router.post('/dislike', auth, actionController.actionDislike)

router.delete('/:id', adminToken, actionController.deleteAction)

module.exports = router;
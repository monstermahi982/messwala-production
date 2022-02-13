const express = require('express');
const actionController = require('../Controllers/actionController');
const auth = require('../Middlewares/auth');

const router = express.Router();

router.get('/', actionController.getActions)

router.post('/like', auth, actionController.actionLike)

router.post('/dislike', auth, actionController.actionDislike)

router.delete('/:id', actionController.deleteAction)

module.exports = router;
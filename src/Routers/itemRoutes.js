const express = require('express');
const itemController = require('../Controllers/itemController');

const router = express.Router();

router.get('/', itemController.get)

router.post('/', itemController.add)

router.delete('/:id', itemController.delete)


module.exports = router;
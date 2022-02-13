const express = require('express');
const staticsController = require('../Controllers/staticsController');

const router = express.Router();

router.get('/mess/:id', staticsController.owner);

router.get('/today', staticsController.todays);

router.get('/users', staticsController.totalUser);


module.exports = router;
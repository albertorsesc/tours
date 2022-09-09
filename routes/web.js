const express = require('express');

const router = express.Router();

const controller = require('../controllers/webController');

router.get('/', controller.overview);
router.get('/tour', controller.getTour);

module.exports = router;

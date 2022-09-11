const express = require('express');

const router = express.Router();
const controller = require('../controllers/webController');

router.get('/', controller.overview);
router.get('/tours/:slug', controller.getTour);

router.get('/login', controller.getLogin);

module.exports = router;

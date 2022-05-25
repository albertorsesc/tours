const express = require('express');
const controller = require('../controllers/userController')
const router = express.Router();

router
.route('/')
.get(controller.index)
.post(controller.store);

router
.route('/:id')
.get(controller.show)
.patch(controller.update)
.delete(controller.destroy);

module.exports = router;
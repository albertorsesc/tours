const express = require('express');
const controller = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(controller.index)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    controller.store
  );

module.exports = router;

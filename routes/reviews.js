const express = require('express');
const controller = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(controller.index)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    controller.setModelsFromRequest,
    controller.store
  );

router
  .route('/:id')
  .get(controller.show)
  .patch(controller.update)
  .delete(controller.destroy);

module.exports = router;

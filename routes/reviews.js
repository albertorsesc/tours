const express = require('express');
const controller = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(controller.index)
  .post(
    authController.restrictTo('user'),
    controller.setModelsFromRequest,
    controller.store
  );

router
  .route('/:id')
  .get(controller.show)
  .patch(authController.restrictTo('user', 'admin'), controller.update)
  .delete(authController.restrictTo('user', 'admin'), controller.destroy);

module.exports = router;

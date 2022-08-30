const express = require('express');
const controller = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', controller.findOrFail);

router.route('/top-5-cheap').get(controller.aliasTopTours, controller.index);

router.route('/stats').get(controller.getTourStats);

router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, controller.index)
  .post(controller.store);

router
  .route('/:id')
  .get(controller.show)
  .patch(controller.update)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    controller.destroy
  );

module.exports = router;

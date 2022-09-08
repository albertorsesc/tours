const express = require('express');
const controller = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();
const reviewRouter = require('./reviews');

router
  .route('/near/:distance/center/:coordinates/unit/:unit')
  .get(controller.getToursWithinDistance);

router
  .route('/distances/:coordinates/unit/:unit')
  .get(controller.getToursByDistance);

router
  .route('/')
  .get(controller.index)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    controller.store
  );

router
  .route('/:id')
  .get(controller.show)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    controller.update
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    controller.destroy
  );

router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(controller.aliasTopTours, controller.index);
router.route('/stats').get(controller.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    controller.getMonthlyPlan
  );

module.exports = router;

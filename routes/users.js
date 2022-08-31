const express = require('express');
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.route('/').get(controller.index).post(controller.store);

router
  .route('/:id')
  .get(controller.show)
  .patch(controller.update)
  .delete(controller.destroy);

module.exports = router;

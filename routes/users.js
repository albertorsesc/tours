const express = require('express');
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/update-password', authController.updatePassword);
router.get('/me', controller.me, controller.show);
router.patch('/update-me', controller.updateMe);
router.delete('/delete-me', controller.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(controller.index).post(controller.store);

router
  .route('/:id')
  .get(controller.show)
  .patch(controller.update)
  .delete(controller.destroy);

module.exports = router;

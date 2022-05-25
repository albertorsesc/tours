const express = require('express');
const controller = require('../controllers/tourController');
const router = express.Router();

// router.param('id', controller.findOrFail);

router.route('/').get(controller.index).post(controller.store);

router
  .route('/:id')
  .get(controller.show)
  .patch(controller.update)
  .delete(controller.destroy);

module.exports = router;

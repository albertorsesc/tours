const Review = require('../models/review');
const factory = require('./handlerFactory');

exports.index = factory.index(Review);
exports.show = factory.show(Review);
exports.store = factory.store(Review);
exports.update = factory.update(Review);
exports.destroy = factory.delete(Review);

exports.setModelsFromRequest = (request, response, next) => {
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }

  next();
};

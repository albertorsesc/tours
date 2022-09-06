const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.index = catchAsync(async (request, response, next) => {
  let filter = {};
  if (request.params.tourId) {
    filter = { tour: request.params.tourId };
  }
  const reviews = await Review.find(filter);

  response.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setModelsFromRequest = (request, response, next) => {
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }

  next();
};

exports.store = factory.store(Review);
exports.update = factory.update(Review);
exports.destroy = factory.delete(Review);

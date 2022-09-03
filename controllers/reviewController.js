const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (request, response, next) => {
  const reviews = await Review.find();

  response.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.store = catchAsync(async (request, response, next) => {
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }
  const review = await Review.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

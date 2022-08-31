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
  const newReview = await Review.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

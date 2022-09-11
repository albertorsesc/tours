const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');

exports.overview = catchAsync(async (request, response, next) => {
  const tours = await Tour.find();

  response.status(200).render('overview', {
    title: 'Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  response.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLogin = (request, response) => {
  response.status(200).render('login', {
    title: 'Login',
  });
};

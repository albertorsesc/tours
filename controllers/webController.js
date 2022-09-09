const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');

exports.overview = catchAsync(async (request, response) => {
  const tours = await Tour.find();

  response.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = (request, response) => {
  response.status(200).render('tour', {
    title: 'The Forest Hiker tour',
  });
};

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

exports.index = catchAsync(async (request, response, next) => {
  const users = await User.find();

  response.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.store = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not defined.',
  });
};

exports.show = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not defined.',
  });
};

exports.update = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not defined.',
  });
};

exports.destroy = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not defined.',
  });
};

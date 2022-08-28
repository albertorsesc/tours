const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirmation: request.body.passwordConfirmation,
  });

  response.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

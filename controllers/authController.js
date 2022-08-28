const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirmation: request.body.passwordConfirmation,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

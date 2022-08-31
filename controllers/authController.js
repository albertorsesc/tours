const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const send = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (request, response, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    role: request.body.role,
    password: request.body.password,
    passwordConfirmation: request.body.passwordConfirmation,
  });

  const token = signToken(newUser._id);

  response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.encryptPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const token = signToken(user._id);

  response.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (request, response, next) => {
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('This user does not exist', 401));
  }

  if (currentUser.updatePasswordChangedAt(decoded.iat)) {
    return next(new AppError('User recently changed password!', 401));
  }

  request.user = currentUser;

  next();
});

exports.restrictTo =
  (...roles) =>
  (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    next();
  };

exports.forgotPassword = catchAsync(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${request.protocol}://${request.get(
    'host'
  )}/api/v1/users/reset-password/${token}}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and password confirmation to: ${resetUrl}. \n If you didn't forget your password, please ignore this email.`;

  try {
    await send({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    response.status(200).json({
      status: 'success',
      message: 'The token was sent to your email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(error);

    return next(
      new AppError(
        'There was an error sending the email, try again later!',
        500
      )
    );
  }
});

exports.resetPassword = (request, response, next) => {};

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

const filterObject = (object, ...allowedFields) => {
  const newObject = {};
  Object.keys(object).forEach((field) => {
    if (allowedFields.includes(field)) {
      newObject[field] = object[field];
    }
  });

  return newObject;
};

exports.updateMe = catchAsync(async (request, response, next) => {
  if (request.body.password || request.body.passwordConfirmation) {
    return next(
      new AppError('Password can not be updated through this action.', 400)
    );
  }

  const filteredRequest = filterObject(request.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(request.user.id, filteredRequest, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user.id, { active: false });

  response.status(204).json({
    status: 'success',
    data: null,
  });
});

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.index = factory.index(User);
exports.show = factory.show(User);
exports.update = factory.update(User);
exports.destroy = factory.delete(User);

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

exports.store = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please Sign up.',
  });
};

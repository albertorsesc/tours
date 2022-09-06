const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.delete = (Model) =>
  catchAsync(async (request, response, next) => {
    const document = await Model.findByIdAndDelete(request.params.id);

    if (!document) {
      return next(new AppError('No document found with provided ID', 404));
    }

    response.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.update = (Model) =>
  catchAsync(async (request, response, next) => {
    const document = await Model.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!document) {
      return next(new AppError('No document found with provided ID', 404));
    }

    response.status(200).json({
      status: 'success',
      data: { data: document },
    });
  });

exports.store = (Model) =>
  catchAsync(async (request, response, next) => {
    const document = await Model.create(request.body);

    response.status(201).json({
      status: 'success',
      data: { document },
    });
  });

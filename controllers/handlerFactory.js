const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');

exports.index = (Model) =>
  catchAsync(async (request, response, next) => {
    // Nested GET reviews on tour.
    let filter = {};
    if (request.params.tourId) {
      filter = { tour: request.params.tourId };
    }

    const features = new ApiFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;

    response.status(200).json({
      status: 'success',
      results: document.length,
      data: { document },
    });
  });

exports.show = (Model, withRelations) =>
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);
    if (withRelations) {
      query = query.populate(withRelations);
    }
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with provided ID', 404));
    }

    response.status(200).json({
      status: 'success',
      data: { document },
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

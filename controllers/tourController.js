const Tour = require('../models/tour');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

/* 
  Get all Tours. 
*/
exports.index = catchAsync(async (request, response, next) => {
  const features = new ApiFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

/* 
  Store a new Tour. 
*/
exports.store = catchAsync(async (request, response, next) => {
  const tour = await Tour.create(request.body);

  response.status(201).json({
    status: 'success',
    data: { tour },
  });
});

/* 
  Find a Tour by ID. 
*/
exports.show = catchAsync(async (request, response, next) => {
  const tour = await Tour.findById(request.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour found with provided ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: { tour },
  });
});

/* 
  Update a Tour by ID. 
*/
exports.update = catchAsync(async (request, response, next) => {
  const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with provided ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.destroy = factory.delete(Tour);

exports.getTourStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        toursCount: { $sum: 1 },
        ratingsCount: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  response.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = request.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourByStartDateCount: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { tourByStartDateCount: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  response.status(200).json({
    status: 'success',
    data: { plan },
  });
});

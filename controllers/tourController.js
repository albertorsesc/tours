const Tour = require('../models/tour');
const ApiFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

/* 
  Get all Tours. 
*/
exports.index = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

/* 
  Store a new Tour. 
*/
exports.store = async (request, response) => {
  try {
    const tour = await Tour.create(request.body);

    response.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

/* 
  Find a Tour by ID. 
*/
exports.show = async (request, response) => {
  try {
    const tour = await Tour.findById(request.params.id);

    response.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    response.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

/* 
  Update a Tour by ID. 
*/
exports.update = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    response.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    response.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

/* 
  Delete a Tour by ID. 
*/
exports.destroy = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);

    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    response.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getTourStats = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

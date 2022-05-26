const Tour = require('../models/tour');

/* const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
) */

/* 
  Get all Tours. 
*/
exports.index = async (request, response) => {
  try {
    console.log(request.query);

    const query = { ...request.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete query[field]);

    let queryString = JSON.stringify(query);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let tourQuery = Tour.find(JSON.parse(queryString));

    if (request.query.sort) {
      const sortBy = request.query.sort.split(',').join(' ');
      tourQuery = tourQuery.sort(sortBy);
    } else {
      tourQuery = tourQuery.sort('-createdAt');
    }

    if (request.query.fields) {
      const fields = request.query.fields.split(',').join(' ');
      tourQuery = tourQuery.select(fields);
    } else {
      tourQuery = tourQuery.select('-__v');
    }

    const page = request.query.page * 1 || 1;
    const limit = request.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    tourQuery = tourQuery.skip(skip).limit(limit);

    if (request.query.page) {
      const tourCount = await Tour.countDocuments();
      if (skip >= tourCount) throw new Error('This page does not exist.');
    }

    const tours = await tourQuery;

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

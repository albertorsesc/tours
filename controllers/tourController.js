const Tour = require('../models/tour');

/* const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
) */

/* 
  Get all Tours. 
*/
exports.index = async (request, response) => {
  try {
    const tours = await Tour.find();

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

const AppError = require('../utils/appError');

const DUPLICATION_ERROR_CODE_MONGODB = 11000;
const CAST_ERROR_CODE_MONGODB = 'CastError';
const VALIDATION_ERROR_PREFIX_MONGODB = 'Validation';

const handleCastErrorDb = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const message = `Duplicate field value: "${error.keyValue.name}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorsDB = (error) => {
  const errors = Object.values(error.errors).map((err) => err.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const devResponse = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const prodResponse = (error, response) => {
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('Error 💥', error);

    response.status(500).json({
      status: 'error',
      message: 'Something went wrong, try again later.',
    });
  }
};

module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    devResponse(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };

    if (err.name === CAST_ERROR_CODE_MONGODB) {
      err = handleCastErrorDb(err);
    }

    if (err.code === DUPLICATION_ERROR_CODE_MONGODB) {
      err = handleDuplicateFieldsDB(err);
    }

    if (err._message.includes(VALIDATION_ERROR_PREFIX_MONGODB)) {
      err = handleValidationErrorsDB(err);
    }

    prodResponse(err, response);
  }
};

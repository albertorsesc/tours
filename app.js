const express = require('express');

const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// # Global Middlewares
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour.',
  })
);

app.use(express.json({ limit: '10kb' }));

// NoSQL injection prevention
app.use(mongoSanitize());

app.use(xss());

app.use(express.static(`${__dirname}/public`));

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();

  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// # Routes

app.get('/', (request, response) => {
  response.json({
    message: 'Hello from the server side!',
    app: 'Natours',
  });
});

app.all('*', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;

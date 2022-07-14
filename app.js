const express = require('express');
const app = express();
const morgan = require('morgan');

// # Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');

app.all('*', (request, response, next) => {
  response.status(404).json({
    status: 'failed',
    message: `Can't find ${request.originalUrl} on this server!`,
  });
});

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

module.exports = app;

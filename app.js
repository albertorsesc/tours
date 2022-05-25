const express = require('express');
const app = express();
const morgan = require('morgan');

// # Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tours')
const userRouter = require('./routes/users')

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();

  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// # Routes

app.get('/', (request, response) => {
  response.json({
    message:'Hello from the server side!',
    app:'Natours'
  });
});


module.exports = app;
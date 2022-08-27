const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (error) => {
  console.log('uncaughtException');
  console.log(error.name, error.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {})
  .then(() => {
    console.log('DB Connection successful!');
  })
  .catch(() => {});

const port = process.env.PORT || 3000;
const server = app.listen(port, (request, response) => {
  console.log(`App running on port: ${port}`);
});

process.on('unhandledRejection', (error) => {
  console.log('Unhandler Rejection, shutting down...');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});

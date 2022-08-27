const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please type in your secure password.'],
    minlength: 8,
  },
  passwordConfirmation: {
    type: [true, 'Please confirm your password.'],
  },
});

const User = mongoose.model('User', schema);

module.exports = User;

const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please type in your secure password.'],
    minlength: 8,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // Only works for save.
      validator: function (confirmation) {
        return confirmation === this.password;
      },
      message: 'Password Confirmation must match the password entered.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresAt: Date,
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;

  next();
});

schema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  // -1 sec, ensuring token is created after password changed.
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

schema.methods.encryptPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

schema.methods.updatePasswordChangedAt = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }

  return false;
};

schema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('User', schema);

module.exports = User;

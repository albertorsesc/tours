const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review content is required.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.pre(/^find/, function (next) {
  /* 
  Deleted because it creates recursive relation loading:
  tour.reviews[0].tour.reviews
  this.populate({ path: 'tour', select: 'name', }); 
  */

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

module.exports = mongoose.model('Review', schema);
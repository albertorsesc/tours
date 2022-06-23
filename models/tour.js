const mongoose = require('mongoose');
const slugify = require('slugify');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name.'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'A tour must have a description.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    isSecret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware:
//  Runs before .save() and .create()
schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

/* schema.pre('save', function (next) {
  console.log('Will save document...');

  next();
});

schema.post('save', function(document, next) {
  console.log(document);

  next();
}); */

// Query Middleware
schema.pre(/^find/, function (next) {
  this.find({ isSecret: { $ne: true } });
  this.start = Date.now();

  next();
});

// eslint-disable-next-line prefer-arrow-callback
schema.post(/^find/, function (documents, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds`);
  console.log(documents);

  next();
});

// Aggregation Middleware
// eslint-disable-next-line prefer-arrow-callback
schema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isSecret: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', schema);

module.exports = Tour;

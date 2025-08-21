const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // restrict rating to 1–5
  },

  review: {
    type: String,
    trim: true,
    default: '', // make optional
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema);

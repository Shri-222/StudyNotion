const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },

  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },

  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming professors are also Users
    required: true,
  },

  whatYouWillLearn: {
    type: String,
    required: true,
    trim: true,
  },

  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      default: [], // starts empty
    },
  ],

  ratingAndReview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RatingAndReview',
      default: [],
    },
  ],

  price: {
    type: Number,
    required: true,
  },

  thumbnail: {
    type: String,
    required: true,
  },

  tags: {
    type: [String], // Make it an array for multiple tags
    default: [],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  
    required: true,
  },

  studentEnroll: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
}, { timestamps: true }); 

module.exports = mongoose.model('Course', courseSchema);

const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // Progress belongs to a specific user
    required: true,
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },

  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSection',  // Assuming each SubSection is a video/lesson
    },
  ],

  lastAccessed: {
    type: Date,
    default: Date.now,  // To track when the user last accessed
  },
}, { timestamps: true });  // Auto adds createdAt and updatedAt

module.exports = mongoose.model('CourseProgress', courseProgressSchema);

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Ensures no leading/trailing spaces
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: [], // Category can start empty
    },
  ],
});

// Export the model
module.exports = mongoose.model('Category', CategorySchema);

const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  timeDuration: {
    type: Number, // store as minutes or seconds
    required: true,
  },

  videoUrl: {
    type: String,
    required: true,
  },

  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section', // link back to Section for easy queries
    required: true,
  },
});

module.exports = mongoose.model('SubSection', subSectionSchema);

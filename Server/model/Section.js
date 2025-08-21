const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true, // enforce section name
    trim: true,
  },

  subSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSection', // make sure your SubSection model matches this
    },
  ],
});

module.exports = mongoose.model('Section', sectionSchema);

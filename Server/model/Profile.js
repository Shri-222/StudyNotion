const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other',
  },

  dateOfBirth: {
    type: Date, // Use Date type for proper queries
  },

  about: {
    type: String,
    trim: true,
    default: '',
  },

  contactNumber: {
    type: String, // String to support international formats
    trim: true,
  },
});

module.exports = mongoose.model('Profile', profileSchema);

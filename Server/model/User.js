const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  contactNumber: {
    type: String, // keep as string to preserve formatting
    trim: true,
    match: /^(\+\d{1,3}[- ]?)?\d{10}$/, // optional regex for phone validation
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // email validation
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },

  accountType: {
    type: String,
    required: true,
    enum: ['Student', 'Professor', 'Admin'],
  },

  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // changed for clarity
  },

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],

  image: {
    type: String,
    default: '', // can store default avatar
  },

  courseProgress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseProgress',
  },

  changePasswordToken: String,
  changePasswordExpires: Date,
});

// Hash password automatically before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if password changed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

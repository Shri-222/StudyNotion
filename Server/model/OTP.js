const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');
const bcrypt = require('bcrypt');

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60, // Expires after 10 minutes
  },
});

// Send verification email
async function sendVerificationMail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      'Verification Mail from StudyNotion',
      `Your OTP is: ${otp}`
    );
    console.log('Mail sent successfully', mailResponse);
    return mailResponse;
  } catch (error) {
    console.error('Error while sending mail', error);
  }
}

// Pre-save hook to hash OTP & send mail
otpSchema.pre('save', async function (next) {
  // Hash OTP for security
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);

  // Send email only for *new* OTPs, not for updates
  if (this.isNew) {
    await sendVerificationMail(this.email, this.otp);
  }

  next();
});

module.exports = mongoose.model('OTP', otpSchema);

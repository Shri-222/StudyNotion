const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {

  if (process.env.NODE_ENV === 'test') {
    return { success: true }; // Skip real email
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465, // or 587 depending on your provider
      secure: true, // true for port 465, false for 587
      service : "gmail", // Use 'gmail' or your email provider
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`, // Proper sender
      to: email,
      subject: title,
      html: body
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error occurred while sending mail:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = mailSender;

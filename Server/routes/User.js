const express = require('express');
const router = express.Router();

const Auth = require('../middleware/auth');
const Login = require('../controller/Auth/Login');
const Signup = require('../controller/Auth/Singup');  // Fixed spelling
const SendOtp = require('../controller/Auth/SendOtp');
const UpdatePassword = require('../controller/Auth/UpdatePassword');
const forgetPassword = require('../controller/ResetPasWord/ForgetPassword');

// Auth Routes
router.post('/login', Login.login);
router.post('/signup', Signup.signup);  // Fixed spelling

// OTP Routes
router.post('/send-otp', SendOtp.SendOtp);

// Change password (must be logged in)
router.post('/change-password', Auth.auth, UpdatePassword.updatePassword);

// Forgot Password Routes - Do NOT require authentication
router.post('/forgot-password-token', forgetPassword.forgetPasswordToken);
router.post('/reset-password', forgetPassword.forgetPassword);

module.exports = router;

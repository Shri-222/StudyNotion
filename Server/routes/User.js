const express = require('express');
const router = express.Router();

const Auth = require('../middleware/auth');
const Login = require('../controller/Auth/Login');
const Signup = require('../controller/Auth/Singup');  // Fixed spelling
const SendOtp = require('../controller/Auth/SendOtp');
const UpdatePassword = require('../controller/Auth/UpdatePassword');

<<<<<<< HEAD

// const Profile = require('../controller/Profile/Profile');
=======
// Auth Routes
router.post('/login', Login.login);
router.post('/signup', Signup.signup);  // Fixed spelling
>>>>>>> recovery-backup

// OTP Routes
router.post('/send-otp', SendOtp.SendOtp);

<<<<<<< HEAD
router.post('/login', Login.login );
router.post ('/singup', Singup.signup);

router.post('/sendotp', SendOtp.SendOtp);
router.post('/changepassword', Auth.auth, Updatepassword.updatePassword);




=======
// Change password (must be logged in)
router.post('/change-password', Auth.auth, UpdatePassword.updatePassword);
>>>>>>> recovery-backup

module.exports = router;


const express = require('express');
const router = express.Router();

const Auth = require('../middleware/auth');
const Login = require('../controller/Auth/Login');
const Singup = require('../controller/Auth/Singup');
const SendOtp = require('../controller/Auth/SendOtp');
const Updatepassword = require('../controller/Auth/UpdatePassword');

const  forgetPassword = require('../controller/ResetPasWord/ForgetPassword');
const Profile = require('../controller/Profile/Profile');


router.post('/login', Login.login );
router.post ('/singup', Singup.signup);

router.post('/sendotp', SendOtp.SendOtp);
router.post('/changepassword', Auth.auth, Updatepassword.updatePassword);


router.post('/forgetpasswordToken', Auth.auth, forgetPassword.forgetPasswordToken);
router.post('/forgetPassword', Auth.auth, forgetPassword.forgetPassword);


module.exports = router;



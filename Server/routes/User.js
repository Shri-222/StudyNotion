
const express = require('express');
const router = express.Router();

const {auth, student, professor, admin } = require('../middleware/auth');
const Login = require('../controller/Auth/Login');
const Singup = require('../controller/Auth/Singup');
const SendOtp = require('../controller/Auth/SendOtp');
const Updatepassword = require('../controller/Auth/UpdatePassword');

const {forgetPasswordToken, forgetPassword} = require('../controller/ResetPasWord/ForgetPassword');
const { updateProfile, deleteProfile, getAllUserDetails } = require('../controller/Profile/Profile');


router.post('/login', Login );
router.post ('/singup', Singup);

router.post('/sendotp', SendOtp);
router.post('/changepassword', auth, Updatepassword);


router.post('/forgetpasswordToken', auth, forgetPasswordToken);
router.post('/forgetPassword', auth, forgetPassword);


module.exports = router;



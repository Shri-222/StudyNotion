

const express = require('express');
const router = express.Router();

const  Profile  = require('../controller/Profile/Profile');
const  forgetPassword = require('../controller/ResetPasWord/ForgetPassword');
const Auth = require('../middleware/auth');

router.put('/updateProfile', Profile.updateProfile);
router.get('/showProfileDetails', Profile.getAllUserDetails);
router.delete('/deleteProfile', Profile.deleteProfile);

router.post('/forgetpasswordToken', Auth.auth, forgetPassword.forgetPasswordToken);
router.post('/forgetPassword', Auth.auth, forgetPassword.forgetPassword);


module.exports = router;
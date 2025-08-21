const express = require('express');
const router = express.Router();

const Profile = require('../controller/Profile/Profile');
const forgetPassword = require('../controller/ResetPasWord/ForgetPassword');
const Auth = require('../middleware/auth');

// Profile Routes - Must be authenticated
router.put('/updateProfile', Auth.auth, Profile.updateProfile);
router.get('/profileDetails', Auth.auth, Profile.getAllUserDetails);
router.delete('/deleteProfile', Auth.auth, Profile.deleteProfile);

// Forgot Password Routes - Do NOT require authentication
router.post('/forgot-password-token', forgetPassword.forgetPasswordToken);
router.post('/reset-password', forgetPassword.forgetPassword);

module.exports = router;

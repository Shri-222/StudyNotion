const express = require('express');
const router = express.Router();

const Profile = require('../controller/Profile/Profile');
const Auth = require('../middleware/auth');

// Profile Routes - Must be authenticated
router.put('/updateProfile', Auth.auth, Profile.updateProfile);
router.get('/profileDetails', Auth.auth, Profile.getAllUserDetails);
router.delete('/deleteProfile', Auth.auth, Profile.deleteProfile);

module.exports = router;

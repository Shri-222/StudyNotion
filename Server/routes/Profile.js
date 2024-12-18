

const express = require('express');
const router = express.Router();

const  Profile  = require('../controller/Profile/Profile');

router.put('/updateProfile', Profile.updateProfile);
router.get('/showProfileDetails', Profile.getAllUserDetails);
router.delete('/deleteProfile', Profile.deleteProfile);


module.exports = router;
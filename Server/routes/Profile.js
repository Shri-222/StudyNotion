

const express = require('express');
const router = express.Router();

const { updateProfile, deleteProfile, getAllUserDetails } = require('../controller/Profile/Profile');

router.put('/updateProfile', updateProfile);
router.get('/showProfileDetails', getAllUserDetails);
router.delete('/deleteProfile', deleteProfile);


module.exports = router
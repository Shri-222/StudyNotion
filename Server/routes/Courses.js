
const express = require('express');
const router = express.Router();

const {auth} = require('../middleware/auth');

const {createCourse, getAllCourses} = require('../controller/Courses/Courses');
const { createSection, updateSection, deleteSection} = require('../controller/Courses/Section');
const { createsubSection, updateSubSection, deleteSubSection} = require('../controller//Courses/subSection');

const { createCategary, getAllCategary, categaryPage } = require('../controller/Categary/Categary');

const { createRatingAndReview, getAverageRating, getAllRatings} = require('../controller/RatingAndReview/RatingAndReview');


router.post('/createCourse', createCourse);
router.get('/getAllCourses', getAllCourses);

router.post('/createSection', createSection);
router.put('/updateSection', updateSection);
router.delete('/deleteSection', deleteSection);

router.post('createsubsection', createsubSection);
router.put('/updateSubsection', updateSubSection);
router.delete('/deleteSubsection', deleteSubSection);



router.post('/createCategary', createCategary);
router.get('/showAllCategary', getAllCategary);
router.get('/getCategaryPages', categaryPage);


router.post('/createRating', createRatingAndReview);
router.get('/showAvarageRating', getAverageRating);
router.get('/showAllReview', getAllCategary);


module.exports = router;
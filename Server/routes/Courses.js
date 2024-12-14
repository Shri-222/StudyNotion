
const express = require('express');
const router = express.Router();

const { auth, student, professor, admin } = require('../middleware/auth');

const {createCourse, getAllCourses} = require('../controller/Courses/Courses');
const { createSection, updateSection, deleteSection} = require('../controller/Courses/Section');
const { createsubSection, updateSubSection, deleteSubSection} = require('../controller//Courses/subSection');

const { createCategary, getAllCategary, categaryPage } = require('../controller/Categary/Categary');

const { createRatingAndReview, getAverageRating, getAllRatings} = require('../controller/RatingAndReview/RatingAndReview');


router.post('/createCourse', auth, professor, createCourse);
router.get('/getAllCourses', getAllCourses);

router.post('/createSection',auth, professor, createSection);
router.put('/updateSection',auth, professor, updateSection);
router.delete('/deleteSection',auth, professor, deleteSection);

router.post('createsubsection',auth, professor, createsubSection);
router.put('/updateSubsection',auth, professor, updateSubSection);
router.delete('/deleteSubsection',auth, professor, deleteSubSection);


router.post('/createCategary', auth, admin, createCategary);
router.get('/showAllCategary',admin, getAllCategary);
router.get('/getCategaryPages',admin, categaryPage);


router.post('/createRating',auth, student, createRatingAndReview);
router.get('/showAvarageRating', student, getAverageRating);
router.get('/showAllReview', student, getAllCategary);


module.exports = router;

const express = require('express');
const router = express.Router();

const Auth  = require('../middleware/auth');

const  Courses  = require('../controller/Courses/Courses');
const  Section = require('../controller/Courses/Section');
const  subSection = require('../controller//Courses/subSection');

const  Categary  = require('../controller/Categary/Categary');

const  RatingAndReview  = require('../controller/RatingAndReview/RatingAndReview');


router.post('/createCourse', Auth.auth, Auth.professor, Courses.createCourse);
router.get('/getAllCourses', Auth.professor, Courses.getAllCourses);

router.post('/createSection', Auth.professor, Section.createSection);
router.put('/updateSection', Auth.professor, Section.updateSection);
router.delete('/deleteSection', Auth.professor, Section.deleteSection);

router.post('createsubsection', Auth.professor,subSection.createsubSection);
router.put('/updateSubsection', Auth.professor, subSection.updateSubSection);
router.delete('/deleteSubsection',Auth.professor, subSection.deleteSubSection);


router.post('/createCategary', Auth.admin, Categary.createCategary);
router.get('/showAllCategary',Auth.admin, Categary.getAllCategary);
router.get('/getCategaryPages',Auth.admin, Categary.categaryPage);


router.post('/createRating', Auth.student, RatingAndReview.createRatingAndReview);
router.get('/showAvarageRating', Auth.student, RatingAndReview.getAverageRating);
router.get('/showAllReview', Auth.student, RatingAndReview.getAllRatings);


module.exports = router;
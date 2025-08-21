const express = require('express');
const router = express.Router();

const Auth = require('../middleware/auth');

const Courses = require('../controller/Courses/Courses');
const Section = require('../controller/Courses/Section');
const subSection = require('../controller/Courses/subSection');
const Category = require('../controller/Categary/Categary');
const RatingAndReview = require('../controller/RatingAndReview/RatingAndReview');

// Courses
router.post('/createCourse', Auth.auth, Auth.professor, Courses.createCourse);
router.get('/getAllCourses', Auth.auth, Auth.professor, Courses.getAllCourses);

// Sections
router.post('/createSection', Auth.auth, Auth.professor, Section.createSection);
router.put('/updateSection', Auth.auth, Auth.professor, Section.updateSection);
router.delete('/deleteSection', Auth.auth, Auth.professor, Section.deleteSection);

// SubSections
router.post('/createSubsection', Auth.auth, Auth.professor, subSection.createsubSection);
router.put('/updateSubsection', Auth.auth, Auth.professor, subSection.updateSubSection);
router.delete('/deleteSubsection', Auth.auth, Auth.professor, subSection.deleteSubSection);

// Categories
router.post('/createCategory', Auth.auth, Auth.admin, Category.createCategary);
router.get('/showAllCategories', Auth.auth, Auth.admin, Category.getAllCategary);
router.get('/getCategoryPages', Auth.auth, Auth.admin, Category.categaryPage);

// Ratings and Reviews
router.post('/createRating', Auth.auth, Auth.student, RatingAndReview.createRatingAndReview);
router.get('/showAverageRating', Auth.auth, Auth.student, RatingAndReview.getAverageRating);
router.get('/showAllReviews', Auth.auth, Auth.student, RatingAndReview.getAllRatings);

module.exports = router;

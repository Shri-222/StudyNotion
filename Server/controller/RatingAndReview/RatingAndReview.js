
const Rating = require('../../model/RatingAndRewive');
const Course = require('../../model/Course');
const User = require('../../model/User');
const mongoose = require('mongoose');

// 1 - create the Rating and Review 

exports.createRatingAndReview = async (req, res) => {
    
    try {

        const userId = req.user.id;

        // fetch data from req body 
            const { courseId, rating, review } = req.body;

        if (!courseId || !rating) {
            return res.status(400).json({ success: false, message: 'Course ID and rating are required.' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
        }

        // check if user is not enroll to this course
            const courseDetails = await Course.findById({_id : courseId, studentEnroll : {$elemMatch : { $eq : userId }}});

            if(!courseDetails) {
                return res.status(401).json({
                    success : false,
                    message : 'Unauthorized, You are not enrolled in this course',
                });
            }

        // check if user is already given rating to this course
            const alreadyRated = await Rating.findOne({
                userId : userId,
                courseId : courseId
            });

            if(alreadyRated) {
                return res.status(400).json({
                    success : false,
                    message : 'You have already given rating to this course.',
                });
            }

        // create entry in db
            const newRatingAndReview = await Rating.create({
                userId,
                courseId,
                rating,
                review,
            });


            const updateCourse = await Course.findOneAndUpdate( courseId , 
                                                                { $push : { 
                                                                    ratings : newRatingAndReview._id
                                                                } },
                                                                { new : true }              
                                                                );

            // console.log('updateCourse - ', updateCourse);

        // return response
        return res.status(201).json({
            success : true,
            message : 'Rating and Review Created Successfully',
            course : updateCourse,
        });

        
    } catch (error) {
        
        console.log('Error While Creating Rating and Review', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Creating Rating and Review, Please try again Later.',
        });
    }
}

// 2 - Avarage rating 

exports.getAverageRating = async (req, res) => {

    try {

        const {courseId} = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Course ID is required.' });
        }

        // genarate Average rating

        const result = await Rating.aggregate(
            {
                $match : { 
                    courseId : new mongoose.Types.ObjectId(courseId),
                 }
            },
            {
                $group : {
                    _id : null,
                    averageRating : { $avg : '$rating' }
                }
            }
        );

        const averageRating = result.length > 0 ? result[0].averageRating : 0;
        
        console.log('Average Rating - ', averageRating);

        // return respons
        return res.status(200).json({
            success : true,
            message : 'Average Rating fetched Successfully',
            averageRating 
        });

    } catch (error) {
        
        console.log('Error While Average Rating and Review', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Average Rating and Review, Please try again Later.',
        });
    }
}

// 3 - get All ratings

exports.getAllRatings = async (req, res) => {

    try {

        const {courseId} = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: 'Course ID is required.' });
        }

        // fetch all ratings

        const allRatings = await Rating.find({ courseId })
                                                .sort({ createdAt : -1 })
                                                .populate({
                                                    path : 'userId',
                                                    select : 'FirstName, LastName, image'
                                                }).exec()

        // console.log('All Ratings - ', allRatings);

        // return response
        return res.status(200).json({
            success : true,
            message : 'All Ratings fetched Successfully',
            allRatings,
        });

    } catch (error) {
        
        console.log('Error While Fetching All Ratings', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Fetching All Ratings, Please try again Later.',
        });
    }
}
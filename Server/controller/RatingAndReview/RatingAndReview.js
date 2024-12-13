
const Rating = require('../../model/RatingAndRewive');
const Course = require('../../model/Course');
const User = require('../../model/User');
const { Mongoose, default: mongoose } = require('mongoose');

// 1 - create the Rating and Review 

exports.createRatingAndReview = async (req, res) => {
    
    try {

        const userId = req.user.id;

        // fetch data from req body 
            const { courseId, rating, review } = req.body;

        // check if user is not enroll to this course
            const courseDetails = await Course.findById({_id : userId, studentEnroll : {$elemMatch : { $eq : userId }}});

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

        // // validation
          /*  if(rating < 1 || rating > 5) {
                return res.status(400).json({
                    success : false,
                    message : 'Rating should be between 1 and 5',
                });
            }*/

        // create entry in db
            const newRatingAndReview = await Rating.create({
                userId : userId,
                courseId : courseId,
                rating : rating,
                review : review,
            });


            const updateCourse = await Course.findOneAndUpdate( {_id : courseId }, 
                                                                { $push : { 
                                                                    ratings : newRatingAndReview._id
                                                                } },
                                                                { new : true }              
                                                                );

            console.log('updateCourse - ', updateCourse);

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

        const courseId = req.body.courseId;

        // genarate Average rating

        const averageRating = await Rating.aggregate(
            {
                $match : { 
                    course : courseId,
                 }
            },
            {
                $group : {
                    _id : null,
                    averageRating : { $avg : '$ratings.rating' }
                }
            }
        );

        console.log('Average Rating - ', averageRating);

        // return respons
        return res.status(200).json({
            success : true,
            message : 'Average Rating fetched Successfully',
            averageRating : averageRating[0].averageRating,
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

        const courseId = req.body.courseId;

        // fetch all ratings

        const allRatings = await Rating.find({ course : courseId })
                                                .sort(ratingAcndRewivw = 'descending')
                                                .populate({
                                                    path : 'ratingAcndRewivw',
                                                     populate : {
                                                         path : 'userId',
                                                         select : 'FirstName, LastName, image'
                                                        }
                                                }).exec()

        console.log('All Ratings - ', allRatings);

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
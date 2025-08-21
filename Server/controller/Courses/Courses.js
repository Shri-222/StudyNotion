
const Course = require('../../model/Course');
const uplodeImageToCloudinary = require('../../utils/ImageUplodeCloudenary');
const Categary = require('../../model/Categary');
const User = require('../../model/User');
const mongoose = require('mongoose');
require('dotenv').config();

exports.createCourse = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;    // in the tags we get the tag ID

        const Thumbnail = req.files.thumbnailImage;

        if ( !courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !Thumbnail) {

            return res.status(400).json({
                success : false,
                message : 'All Fields Are Required',
            });
        }


        const userId = req.user.id;
        const professorDetails = await User.findById(userId);
        console.log('Professor Details :- ', professorDetails);

        if ( !professorDetails || professorDetails.accountType !== 'instructor' ) {
            return res.status(403).json({
                success : false,
                message : 'Only instructors can create courses.',
            });
        }

        const givenTags = await Categary.findById(tag);
        if (!givenTags) {
            return res.status(400).json({
                success : false,
                message : 'Invalid Tag, Please Provide a Valid Tag',
            });
        }


        const imageUplode = await uplodeImageToCloudinary(Thumbnail, process.env.CLOUDENARY_FOLDER);

         if (!imageUplode || !imageUplode.secure_url) {
            throw new Error('Thumbnail upload failed.');
        }

        const newCourse = await Course.create(
            [{
                courseName : courseName,
                courseDescription : courseDescription,
                whatYouWillLearn : whatYouWillLearn,
                price : price,
                thumbnail : imageUplode.secure_url,
                professor : professorDetails._id,
                Tag : givenTags._id
            }],
            { session: session }
        );


        await User.findByIdAndUpdate(
            {_id : professorDetails._id },

            {
                $push :
                { courses : newCourse[0]._id }
            },

            { session },
            { new : true}

        );

        await Categary.findByIdAndUpdate(
            {_id : givenTags._id },

            {
                $push :
                {
                    courses : newCourse._id
                }
            },
            { session },
            { new : true}
        );

        await session.commitTransaction();


        return res.status(200).json(
            {
                success : true,
                message : 'Course Created Successfully',
                course : newCourse[0],
                professor : professorDetails,
                // tag : givenTags,
                // thumbnail : imageUplode.secure_url,
                // user : professorDetails,
            }
        );


    } catch (error) {
        await session.abortTransaction();
        console.log('Error While Creating Course', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Creating Course, Please try again Leater',
        });
    } finally {
        session.endSession();
  }
}

// 2 - Get All Courses 

exports.getAllCourses = async (req, res) => {

    try {
        const { page = 1, limit = 20 } = req.query;

        const allCourses = await Course.find({}, {
                                                  courseName : true,
                                                  price : true,
                                                  Thumbnail : true,
                                                  professor : true,
                                                  ratingAndReview : true,
                                                  studentEnroll : true
                                                }).populate('professor', 'firstName lastName email')
                                                  .skip((page -1 ) * limit)
                                                  .limit(Number(limit))
                                                  .exec();

        return res.status(200).json(
            {
                success : true,
                message : 'Courses fetched successfully.',
                total: allCourses.length,
                page: Number(page),
                courses: allCourses,
            }
        )
        
    } catch (error) {
        
        console.log('Error While Fetching All Courses', error);

        res.status(500).json(
            {
                success : false,
                message : 'Error While Fetching All Courses, Please try again Later.',
                error: error.message,
            }
        );
    }
}
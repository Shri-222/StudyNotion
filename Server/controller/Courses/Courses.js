// 1 - Create a new Course Handler

// fetch data from req body
// fetch Thumbnail from req files 
// validation
// check for professor 
// check given tags is valide or not
// uplode image to cloudinary to save 
// create an entry for new course
// add the new course to the user schemas of professor
// update the Tages schemas
// return response

const Course = require('../../model/Course');
const uplodeImageToCloudinary = require('../../utils/ImageUplodeCloudenary');
const Categary = require('../../model/Categary');
const User = require('../../model/User');
require('dotenv').config();

exports.createCourse = async (req, res) => {
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

        if ( !professorDetails ) {
            return res.status(401).json({
                success : false,
                message : 'Unauthorized, You are not a Professor',
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

        const newCourse = await Course.create(
            {
                courseName : courseName,
                courseDescription : courseDescription,
                whatYouWillLearn : whatYouWillLearn,
                price : price,
                thumbnail : imageUplode.secure_url,
                professor : professorDetails._id,
                Tag : givenTags._id
            }
        );


        await User.findByIdAndUpdate(
            {_id : professorDetails._id },

            {
                $push :
                {
                    courses : newCourse._id
                }
            },

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

            { new : true}
        );


        return res.status(200).json(
            {
                success : true,
                message : 'Course Created Successfully',
                course : newCourse,
                professor : professorDetails,
                // tag : givenTags,
                // thumbnail : imageUplode.secure_url,
                // user : professorDetails,
            }
        );


    } catch (error) {
        
        console.log('Error While Creating Course', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Creating Course, Please try again Leater',
        });
    }
}



// 2 - Get All Courses 

exports.getAllCourses = async (req, res) => {

    try {

        const allCourses = await Course.find({}, {
                                                  courseName : true,
                                                  price : true,
                                                  Thumbnail : true,
                                                  professor : true,
                                                  ratingAcndRewivw : true,
                                                  studentEnroll : true
                                                }).populate('professor').exec();

        return res.status(200).json(
            {
                success : true,
                message : 'All Courses.',
                allCourses,
            }
        )
        
    } catch (error) {
        
        console.log('Error While Fetching All Courses', error);

        res.status(500).json(
            {
                success : false,
                message : 'Error While Fetching All Courses, Please try again Later.',
            }
        );
    }
}
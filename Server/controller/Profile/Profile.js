
// 1 - update the Profile Details becausewe create the frofile in signup section

const User = require('../../model/User');
const Profile = require('../../model/Profile');
const Course = require('../../model/Course');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

exports.updateProfile = async (req, res) => {

    try {

        const { gender, dateOfBirth, contactNumber, about } = req.body;

        const payload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userID = payload.id;

        const userDetails = await User.findById( userID); 

        if (!userDetails) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const profileDetails = await Profile.findById(userDetails.additionalDetails);

         if (!profileDetails) {
            return res.status(404).json({ success: false, message: 'Profile not found.' });
        }

        profileDetails.gender = gender || profileDetails.gender;
        profileDetails.dateOfBirth = dateOfBirth || profileDetails.dateOfBirth;
        profileDetails.contactNumber = contactNumber || profileDetails.contactNumber;
        profileDetails.about = about || profileDetails.about;

        await profileDetails.save();

        res.status(200).json(
            {
                success : true,
                massage : ' Profile Updated Successfully',
                data : profileDetails
            }
        )
        
    } catch (error) {
        
        console.log('Error While updating profile', error);
        return res.status(404).json(
            {
                success : false,
                massage : 'Error while updating profile'
            }
        );
    }
}

// 2 - Delete Profile

exports.deleteProfile = async ( req, res ) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const userid = req.user.id;

        if (!userid) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userDetails = await User.findById(ID);

        if ( !userDetails ) {
            
            return res.status(401).json(
                {
                    success : false,
                    massage : 'User not Found',
                }
            );
        }

        
        // Remove user from all enrolled courses
        await Course.updateMany(
                                { studentEnroll: userid },
                                { $pull: { studentEnroll: userid } },
                                { session }
        );


        await Profile.findByIdAndDelete( userDetails.additionalDetails , { session });

        await User.findByIdAndDelete( userid, { session });

        await session.commitTransaction();
        session.endSession();
        
        res.status(200).json(
            {
                success : true,
                massage : 'Profile Deleted Successfully',
            }
        );
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting profile:', error);
        return res.status(500).json({ success: false, message: 'Error deleting profile.' });
    }
}

// 3 - Get All Users Details

exports.getAllUserDetails = async ( req, res ) => {

    try {

        const payload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userID = payload.id;

        // console.log(userID)

        const user = await User.findById(userID).populate('additionalDetails').exec();
        // console.log(profile)

        if (!user ) {
            return res.status(401).json(
                {
                    success : false,
                    massage : 'User not Found',
                }
            );
        }


        res.status(200).json(
            {
                success : true,
                massage : 'User Details',
                data : user,
            }
        );
        
    } catch (error) {
        
        console.log('Error While Fetching profile', error);
        return res.status(404).json(
            {
                success : false,
                massage : 'Error while Fetching profile'
            }
        );
    }
}

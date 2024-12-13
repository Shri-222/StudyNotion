
// 1 - update the Profile Details becausewe create the frofile in signup section

// fetch the data from req body
// fetch user id from req.user we created plylode in login
// find user details
// find profile 
// update profile
// return respons

const User = require('../../model/User');
const Profile = require('../../model/Profile');
const Course = require('../../model/Course');
const { default: mongoose } = require('mongoose');

exports.updateProfile = async (req, res) => {

    try {

        const { gender, dateOfBirth, contactNumber, about } = req.body;

        const userID = req.user.id;

        const userDetails = await User.findById(userID);
        const profileID = await userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileID);

        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;

        await profileDetails.save();

        res.status(200).json(
            {
                success : true,
                massage : ' Profile Updated Successfully',
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

// Get id waya playlode
// validation
// Delete the student from all the courses he enroled
// delete first additional details
// delete the profile
// return response


exports.deleteProfile = async ( req, res ) => {

    try {

        const ID = req.user.id;

        const userDetails = await User.findById(ID);

        if ( !userDetails ) {
            
            return res.status(401).json(
                {
                    success : false,
                    massage : 'User not Found',
                }
            );
        }

        await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});

        await User.findByIdAndDelete({_id : ID});
        
        res.status(200).json(
            {
                success : true,
                massage : 'Profile Deleted Successfully',
            }
        );

        // const studID = mongoose.Schema.Types.ObjectId(ID);
        // const studentEnroll = await Course.studentEnroll.findByIdAndDelete({_id : studID});
        
    } catch (error) {
        
    }
}



// 3 - Get All Users Details

// get id from users playlod
// validation and find user details
// retuen respons

exports.getAllUserDetails = async ( req, res ) => {

    try {

        const ID = req.user.id;

        const profile = await User.findById(ID).populate('additionalDetails').exec();

        if (!profile ) {
            
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
                data : profile,
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

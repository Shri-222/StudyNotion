
const OTP = require('../../model/OTP');
const User = require('../../model/User');
const Profile = require('../../model/Profile'); 
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {

    try {
        //feach the data from requiest body

        const 
        {
            firstName , 
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp 
        } = req.body;

       //validation the data 

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success : false,
                massage : 'Please fill all fields'
            });
        }

        // check the 2 passwords maches

        if (password !== confirmPassword) {
            return res.status(400).json({
                success : false,
                massage : 'Passwords do not match'
            });
        }

        //cheack user already existed

        const checkUserExisted = await User.findOne({email});

        if (checkUserExisted) {
            return res.status(400).json({
                success : false,
                massage : 'User with this email already exist'
            });
        }
        
        //find most resent OTP

        const checkOtpExisted = await OTP.findOne({email}).sort({createAt: -1}).limit(1);

        // console.log(' This is otp :-', checkOtpExisted);

        //validate OTP
        if (checkOtpExisted.length == 0) {
                return res.status(400).json({
                    success : false,
                    massage : 'OTP Not Found'
                });
        } 
        else if (checkOtpExisted.otp !== otp) {
            return res.status(400).json({
                success : false,
                massage : 'Invalid OTP'
            });
        }
        

        // Hash password

        const hashPassword = await bcrypt.hash(password, 10);
        
        //create the Entry in DB

        const profileDetails = await Profile.create(
            {
                gender : null,
                dateOfBirth : null,
                contactNumber : null,
                about : null,
            }
        );

        const user = await User.create(
            {
                FirstName : firstName,
                LastName : lastName,
                email :  email,
                password :  hashPassword,
                accountType : accountType,
                contactNumber : contactNumber,
                additionalDetails : profileDetails._id,
                // image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
                image : `https://api.dicebear.com/9.x/lorelei/svg?seed=${firstName}${lastName}`,
            }
        );

        console.log(user);

        //return Response
        res.status(200).json(
            {
                success : true,
                massage : 'User Created Successfully',
                Data : user ,
            }
        )
   
    } catch (error) {
        console.error('Error while Creating an account', error);
        return res.status(500).json({
            success : false,
            massage : 'Error while Creating an account'
        });
    }
}
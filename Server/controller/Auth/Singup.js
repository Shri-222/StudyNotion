//feach the data from requiest body
//validation the data
// check the 2 passwords maches
//cheack user already existed

//find most resent OTP
//validate OTP

// Hash password
//create the Entry in DB

//return Response



const OTP = require('../../model/OTP');
const User = require('../../model/User');
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {
    try {

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

        
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success : false,
                massage : 'Please fill all fields'
            });
        }


        if (password !== confirmPassword) {
            return res.status(400).json({
                success : false,
                massage : 'Passwords do not match'
            });
        }


        const checkUserExisted = await User.findOne({email});

        if (checkUserExisted) {
            return res.status(400).json({
                success : false,
                massage : 'User with this email already exist'
            });
        }

        const checkOtpExisted = await OTP.findOne({email}).sort({createAt: -1}).limit(1);
        console.log(checkOtpExisted);

        if (checkOtpExisted.length == 0) {
                return res.status(400).json({
                    success : false,
                    massage : 'OTP Not Found'
                });
        } else if (checkOtpExisted !== otp) {
            return res.status(400).json({
                success : false,
                massage : 'Invalid OTP'
            });
        }


        const hashPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create(
            {
                gender : null,
                dateOfBirth : null,
                contactNumber : null,
                about : null,
            }
        );

        const user = new User({
            firstName,
            lastName,
            email,
            password :  hashPassword,
            accountType,
            contactNumber,
            profile : profileDetails._id,
            // image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            image : `https://api.dicebear.com/9.x/lorelei/svg?seed=${firstName} ${lastName}`,
        });


        res.status(200).json(
            {
                success : true,
                massage : 'User Created Successfully',
                user ,
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
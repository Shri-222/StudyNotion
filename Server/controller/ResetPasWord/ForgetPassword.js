// 1 - Reset Password Token

// feach Data from req Body 
// validation and Chack User Exist or not
// Genarate Token using crypto and save into users Database 

// share the FrontEnd Link by mailSender 
// return response


const User = require('../../model/User');
const mailSender = require('../../utils/MailSender');
const bcrypt = require('bcrypt');


exports.forgetPasswordToken = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'User Not Found'
                }
            );
        }



        const token = crypto.randomUUID();
        console.log("this is Token " ,  token);

        const updatedDetails = await User.findOneAndUpdate(
            { email },
            { $push : {
                resetPasswordToken: token, 
                resetPasswordExpires: Date.now() + 10 * 60 * 1000      // 10 minutes
                } 
            }, 
            { new: true }
        );

        console.log("This is token base user :-", updatedDetails);


        const frontEndLink = `https://localhost:3000/ForgotPassword/${token}`;

        await mailSender(
            email, 
            'Yor Reset Password Link',
            `Your Reset Password Link:-  ${frontEndLink}   Link Will be Close after 10 minutes`,
        );


        res.status(200).json(
            {
                success : true,
                message : 'Reset Password Link has been sent to your Email'
            }
        );
        
    } catch (error) {
        
        console.log('Error while Reseting Password' , error);   
        res.status(404).json(
            {
                success : false,
                massage : 'Somthing Went Wrong while sending Mail Password'
            }
        );
    }
}



// 2 - Password Chenge After clicking the Email Link

// feach the data from req body 
// validation
// get User details by the token We saved
// check Token validation - Invalide Token
// check Token Expiry time

// hash password 
// password Update
// return respons


exports.forgetPassword = async (req, res) => {

    try {

        const { token, password, comfirmPassword } = req.body;

        if ( !password || !comfirmPassword ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Password and Confirm Password is Required'
                }
            );
        } 

        if ( password !== comfirmPassword ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Passwords do not match'
                }
            );
        }


        const userDetails = await User.findOne({resetPasswordToken : token});
        console.log("this is user Detais :-", userDetails)

        if ( !userDetails ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Invalid Token'
                }
            );
        }

        if ( userDetails.resetPasswordExpires < Date.now() ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Token is Expired'
                }
            );
        }


        const hashPassword = bcrypt.hash(password, 10); 

        await User.findOneAndUpdate(
            { resetPasswordToken : token },
            { password : hashPassword },
            { new : true },
        );


        await mailSender(
            userDetails.email,
            'Successfully Chenged Password',
            'Your StudyNotion Password has been successfully changed ',
        );


        res.status(200).json(
            {
                success : true,
                message : 'Password has been successfully changed'
            }
        );

        
    } catch (error) {
        
        console.log('Error while Changing Password' , error);
        res.status(404).json(
            {
                success : false,
                massage : 'Somthing Went Wrong while Reseting Password'
            }
        );
    }
}
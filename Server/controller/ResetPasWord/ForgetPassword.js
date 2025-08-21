
const User = require('../../model/User');
const mailSender = require('../../utils/MailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


exports.forgetPasswordToken = async (req, res) => {

    try {

        const { email } = req.body;

         if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

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

        // console.log("this is Token " ,  token);

        const updatedDetails = await User.findOneAndUpdate(
<<<<<<< HEAD
            { email : email },
=======
            { email },
>>>>>>> recovery-backup
            { 
                changePasswordToken: token, 
                changePasswordExpires: Date.now() + 10 * 60 * 1000      // 10 minutes
            }, 
            { new : true }
        );

        // console.log("This is token base user :-", updatedDetails);


        const frontEndLink = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetLink = `${frontEndLink}/reset-password/${token}`;

        await mailSender(
            email, 
            'Yor Reset Password Link',
            `<p> Click the following link to reset your password:</p>
                <a href= "${process.env.CLIENT_URL}/reset-password/${token}". This link will expire in 10 minutes. </a>`,
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

        const { token, password, confirmPassword } = req.body;

        
        if (!token) {
            return res.status(400).json({ success: false, message: 'Reset token is required' });
        }

        if ( !password || !confirmPassword ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Password and Confirm Password is Required'
                }
            );
        } 

        if ( password !== confirmPassword ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Passwords do not match'
                }
            );
        }


        const userDetails = await User.findOne({changePasswordToken : token});
<<<<<<< HEAD
        console.log("this is user Detais :-", userDetails)
=======
        // console.log("this is user Details :-", userDetails)
>>>>>>> recovery-backup

        if ( !userDetails ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Invalid or expired Token'
                }
            );
        }

        if ( userDetails.changePasswordExpires < Date.now() ) {
            return res.status(400).json(
                {
                    success : false,
                    massage : 'Reset Token has Expired'
                }
            );
        }


<<<<<<< HEAD
        const hashPassword = await bcrypt.hash(password, 10); 

        const updatedUser = await User.findOneAndUpdate(
            { changePasswordToken : token },
            { password : hashPassword },
            { new : true },
        );
=======
        const hashedPassword = await bcrypt.hash(password, 10); 

        console.log("this is hashed Password :-", hashedPassword);

        userDetails.password = hashedPassword;
        userDetails.changePasswordToken = null;
        userDetails.changePasswordExpires = null;
        await userDetails.save();
>>>>>>> recovery-backup


        await mailSender(
            userDetails.email,
            'Successfully Changed Password',
            'Your StudyNotion Password has been successfully Updated. ',
        );


        res.status(200).json(
            {
                success : true,
                message : 'Password has been successfully changed',
<<<<<<< HEAD
                data : updatedUser
=======
                // data : updatedUser
>>>>>>> recovery-backup
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
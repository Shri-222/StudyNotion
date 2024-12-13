// feach the Data from requiest Body
// get OldPassword NewPassword, Confirm Password
// validation

// check if old password is correct
// Update old password to New in DB
// Send the mail to the User
// return response


const User = require('../../model/User');
const bcrypt = require('bcrypt');
const mailSender = require('../../utils/MailSender');


exports.updatePassword = async (req, res) => {

    try {

        const { email, oldPassword, password, confirmPassword } = req.body;

        if ( !email || !oldPassword || !password || !confirmPassword ) {
            return res.status(401).json(
                {
                    success : false,
                    message : 'Please provide all required fields',
                }
            );
        }  

        const user = await User.findOne({email});

        if ( !user ) {
            return res.status(401).json(
                {
                    success : false,
                    message : 'User not found || Email is incorrect',
                }
            );
        }


        const passwordIsMatch = await bcrypt.compare(oldPassword, user.password);

        if ( !passwordIsMatch ) {
            return res.status(401).json(
                {
                    success : false,
                    message : 'Old Password is incorrect',
                }
            );
        }


        if ( password !== confirmPassword ) {
            return res.status(401).json(
                {
                    success : false,
                    message : 'Passwords do not match',
                }
            );
        }


        user.password = await bcrypt.hash(password, 10);


        await user.save();
        console.log('Updated User After Password Changed', user);
        
        

            await mailSender( email, "Successfully Chenged Password", "Your StudyNotion Password has been successfully changed ");
            

        res.status(200).json(
            {
                success : true,
                message : 'Password Changed Successfully',
                user,
            }
        );





        
    } catch (error) {
        console.log('Error While Changing Password', error);
        return res.status(500).json (
            {
                success : false,
                message : 'Error while Changing Password, Please try again Later.',
            }
        );
        
    }
}
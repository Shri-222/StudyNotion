
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
            return res.status(404).json(
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
            return res.status(400).json(
                {
                    success : false,
                    message : 'Passwords do not match',
                }
            );
        }


        user.password = await bcrypt.hash(password, 10);


        await user.save();
        console.log('Updated User After Password Changed', user);
        try {
            await mailSender(
                email,
                'Password Changed Successfully',
                'Your StudyNotion password has been successfully updated.'
            );
        } catch (err) {
            console.error('Password updated, but failed to send email:', err.message);
        }

        res.status(200).json(
            {
                success : true,
                message : 'Password Changed Successfully',
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
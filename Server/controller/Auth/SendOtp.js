
const User = require('../../model/User');
const OTP = require('../../model/OTP');
const GenerateOtp = require('otp-generator')
const bcrypt = require('bcrypt');
const {sendVerificationMail} = require('../../model/OTP');

exports.SendOtp = async (req, res) => {

    try {
        const {email} = req.body;

        const checkUserExisted = await User.findOne({email});

        if(checkUserExisted) {
            return res.status(400).jason({
                success : false,
                massage : 'User Already Existed. Please log in.'
            });
        }

        var otp = GenerateOtp.generate(6, {
            digits : true,
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });

        console.log('OTP :- ', otp);

        const hashedOtp = await bcrypt.hash(otp.toString(), 10)

        const OtpPayload = {email , otp : hashedOtp};

        const otpBody = await OTP.create(OtpPayload);
        console.log('otp save in DB ', otpBody);

        await sendVerificationMail(email, otp);

        res.status(200).json({
            success : true,
            massage : 'OTP sent successfully',
        });
        


    } catch (error) {
        console.error('Error while sending OTP ', error);
        res.status(500).json({
            success : false,
            massage : 'Error while sending OTP'
        });
    }

}
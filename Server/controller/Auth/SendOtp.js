//Feach Email from Requist Body
//Check User Already Existed or Login
//if User already exists then return respond
//Generate OTP
//Create Playlode 
// Create Entry in DB
// Return Respons


const User = require('../../model/User');
const OTP = require('../../model/OTP');
const GenerateOtp = require('otp-generator')


exports.SendOtp = async (req, res) => {

    try {
        const {email} = req.body;

        const checkUserExisted = await User.findOne({email});

        if(checkUserExisted) {
            return res.status(400).jason({
                success : false,
                massage : 'User Already Existed'
            });
        }

        var otp = GenerateOtp.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });

        console.log('OTP :- ', otp);

        const OtpPlaylod = {email , otp};

        const otpBody = await OTP.create(OtpPlaylod);
        console.log('otp save in DB ', otpBody);

        res.status(200).jason({
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
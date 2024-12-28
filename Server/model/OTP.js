const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');

const otpSchemas = new mongoose.Schema({
   
    email : {
        type : String, 
        required : true,
    },

    otp : {
        type : String,
        required : true,
    },

    created_at : {
        type : Date,
        default : Date.now,
        expires : 30 * 60, // 10 minutes of expiration
    },
});


// it is created for sending mail

async function sendVarificationMail (email, otp) {
    try {
            const mailResponse = await mailSender(
                email,
                'VarificationMail From StudyNotion',
                otp
            );

            console.log("Mail sent successfully", mailResponse);
            return mailResponse;
    }
    catch (error) {
        console.error("Error while sending mail", error);

    }
}

otpSchemas.pre("save", async function (next) {
    await sendVarificationMail(this.email, this.otp);
    next();
})


module.exports = mongoose.model('OTP', otpSchemas);
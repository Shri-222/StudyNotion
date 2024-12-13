// this is for sending the mail for varification to the users

const nodemailer = require('nodemailer')
require('dotenv').config();


const mailSender = async (email , title, body) => {
    try {
        let transport = nodemailer.createTransport(
            {
                host : process.env.MAIL_HOST,
                auth : {
                    user : process.env.MAIL_USER,
                    pass : process.env.MAIL_PASS
                }
            }
        )

        let info = await transport.sendMail(
            {
                from : 'StudyNotion',
                to :    `${email}`,
                subject : `${title}`,
                html : `${body}`
            }
        )

        console.log(info);
        
    }
    catch ( error ) {
        console.log ("Error occured While Sending Mail");
        console.error(error);
        return res.status(401).json({
            success : false,
            massage : 'Error while sending mail'
        })
    }
};


module.exports = mailSender;
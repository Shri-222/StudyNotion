
const User = require('../../model/User');
const Course = require('../../model/Course');
const { instance } = require('../../config/razorPay');
const MailSender = require('../../utils/MailSender');
const { default: mongoose } = require('mongoose');
const crypto = require('crypto');

// 1 - create or capture the payment order

exports.capturePaymentOrder = async (req, res) => {

    try {

        // get the CourseID and UserID

        const { courseID, userID } = req.body;

        if( !courseID || !userID ) {
            return res.status(400).json(
                {
                    success : false,
                    message : 'CourseID and UserID are required.'
                }
            );
        }

        // validetion of courseID

        const user = await User.findById({userID});
        const course = await Course.findById({courseID});
        
        // validetion of courseDetails or course info

        if( !course ) {
            return res.status(404).json(
                {
                    success : false,
                    message : 'Course Not Found.',
                }
            );
        }
        
        // validation if user is alredy parcheses or enrolled this course
        
        // const uId = new mongoose.Types.ObjectId(userID);
        // const isEnrolled = user.courses.includes(courseID);

        if( user.courses.includes(courseID) ) {
            return res.status(400).json(
                {
                    success : false,
                    message : 'User is already enrolled in this course.',
                }
            );
        }

        // then create order - create options - initilize the payment using razorPay - return response

        const amount = course.price;
        const currency = 'INR'

        const options = {
            amount : amount * 100,
            currency : currency,
            description : `Payment for Course - ${course.courseName}`,
            receipt : Math.random(Date.now()).toString(),
            payment_capture : true,
            notes : {
                courseID : courseID,
                userID : userID
            }
        }

        try {

            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            return res.status(200).json(
                {
                    success : true,
                    message : 'Payment Order Created Successfully.',
                    courseName : course.courseName,
                    courseDescription : course.courseDiscription,
                    courseThumbnel : course.thumbnail,
                    pymentId : paymentResponse.id,
                    currency : paymentResponse.currency,
                    amount : paymentResponse.amount
                }
            )
            
        } catch (error) {
                
            console.log('Error While creating Order', error);
            return res.status(500).json(
                {
                    success : false,
                    message : 'Error While creating Order, Please try again Later.',
                }
            );
        }

        
    } catch (error) {
        
        console.log('Error While Paymenting', error);
        return res.status(500).json(
            {
                success : false,
                message : 'Error While Paymenting, Please try again Later.',
            }
        );
    }
}


// 2 - verify the payment order

exports.verifyPaymentOrder = async (req, res) => {

    const webhooksecret = process.env.WEBHOOK_SECRET ;

    const signature = req.header['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha1', webhooksecret);
    shasum.update(JSON.stringify(req.body));
    const computedSignature = shasum.digest('hex');
    
    
    if( signature === computedSignature ) {
        console.log('Payment is Authorised');

        const { courseID, userID } = req.body.payload.payment.entity.notes;
        
        try {
             const courseEnroll = await Course.findByIdAndUpdate(
                                                                    { _id : courseID },
                                                                    { $push : { studentEnroll : userID } },
                                                                    { new : true }
                                                                    );
                
                console.log(courseEnroll);

                if( !courseEnroll ) {
                    return res.status(404).json(
                        {
                            success : false,
                            message : 'Course Not Found.',
                        }
                    );
                }

                const userEnroll = await User.findByIdAndUpdate(
                                                                { _id : userID },
                                                                { $push : { courses : courseID } },
                                                                { new : true }
                                                                );
                
                console.log(userEnroll);
                
                if(!userEnroll ) {
                    return res.status(404).json(
                        {
                            success : false,
                            message : 'User Not Found.',
                        }
                    );
                }

                const emailSender = await MailSender(
                                                        userEnroll.email,
                                                        'Course Enrollment Confirmation',
                                                        `You have successfully enrolled in the course - ${courseEnroll.courseName}`
                                                    );

                console.log(emailSender);
                return res.status(200).json(
                    {
                        success : true,
                        message : 'Payment is Successful.',
                        courseName : courseEnroll.courseName,
                        courseDescription : courseEnroll.courseDiscription,
                        courseThumbnel : courseEnroll.thumbnail,
                    }
                )
        } catch (error) {
                
            console.log('Error While Verifying Payment', error);
            return res.status(500).json(
                {
                    success : false,
                    message : 'Error While Verifying Payment, Please try again Later.',
                }
            )
        }
               


    } else {
        console.log('Payment is not Authorised');
        return res.status(401).json(
            {
                success : false,
                message : 'Payment is not Authorised.',
            }
        )
    }
       
}
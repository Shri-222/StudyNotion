
const razorpay = require('razorpay');
require('dotenv').config();

exports.instance = new razorpay (
    {
        key_id : process.env.PAY_KEY_ID,
        key_secret : process.env.PAY_KEY_SECRET,
        // currency : 'INR',
        // amount : 100, // 100 rupees
    }
);
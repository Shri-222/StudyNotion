
const express = require('express');
const router = express.Router();

const Payment  = require('../controller/Payment/Payment');
const  Auth = require('../middleware/auth');

router.post('/capturePayment', Auth.student, Payment.capturePaymentOrder);
router.post('/verifyPayment', Payment.verifyPaymentOrder);


module.exports = router;
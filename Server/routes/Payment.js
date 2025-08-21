const express = require('express');
const router = express.Router();

const Payment = require('../controller/Payment/Payment');
const Auth = require('../middleware/auth');

// Capture Payment - Only Students
router.post('/capturePayment', Auth.auth, Auth.student, Payment.capturePaymentOrder);

// Verify Payment - Also Restricted to Students (if needed)
router.post('/verifyPayment', Auth.auth, Auth.student, Payment.verifyPaymentOrder);

module.exports = router;

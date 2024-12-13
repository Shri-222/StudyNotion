
const express = require('express');
const router = express.Router();

const { capturePaymentOrder, verifyPaymentOrder } = require('../controller/Payment/Payment');
const { auth, student } = require('../middleware/auth');

router.post('/capturePayment', auth, student, capturePaymentOrder);
router.post('/verifyPayment', verifyPaymentOrder);


module.exports = router;
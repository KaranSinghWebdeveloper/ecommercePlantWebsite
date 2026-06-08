const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');

router.post('/', orderController.createOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.get('/:orderNumber', orderController.getOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller');

router.post('/summary', checkoutController.getCheckoutSummary);

module.exports = router;

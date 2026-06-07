const express = require('express');
const router = express.Router();
const deliveryController = require('./delivery.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/options', cacheMiddleware, deliveryController.checkDeliveryOptions);

module.exports = router;

const express = require('express');
const router = express.Router();
const bannerController = require('./banner.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/', cacheMiddleware, bannerController.getBanners);

module.exports = router;

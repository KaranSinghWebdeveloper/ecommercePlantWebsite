const express = require('express');
const router = express.Router();
const homeController = require('./home.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/', cacheMiddleware, homeController.getHomeData);

module.exports = router;

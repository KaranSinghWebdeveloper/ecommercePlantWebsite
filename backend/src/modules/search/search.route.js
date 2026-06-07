const express = require('express');
const router = express.Router();
const searchController = require('./search.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/suggest', cacheMiddleware, searchController.getSuggestions);

module.exports = router;

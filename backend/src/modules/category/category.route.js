const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/', cacheMiddleware, categoryController.getCategories);
router.get('/slug/:slug', cacheMiddleware, categoryController.getCategoryBySlug);

module.exports = router;

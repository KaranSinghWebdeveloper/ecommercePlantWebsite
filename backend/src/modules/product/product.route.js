const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/', cacheMiddleware, productController.getProducts);
router.get('/slug/:slug', cacheMiddleware, productController.getProductBySlug);

module.exports = router;

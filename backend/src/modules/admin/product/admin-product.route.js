const express = require('express');
const router = express.Router();
const productController = require('./admin-product.controller');
const { adminAuthMiddleware } = require('../../../middleware/auth.middleware');

router.use(adminAuthMiddleware);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/images', productController.addProductImage);
router.delete('/:id/images/:imageId', productController.removeProductImage);

module.exports = router;

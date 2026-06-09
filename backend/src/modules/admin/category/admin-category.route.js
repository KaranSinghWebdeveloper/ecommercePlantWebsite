const express = require('express');
const router = express.Router();
const categoryController = require('./admin-category.controller');
const { adminAuthMiddleware } = require('../../../middleware/auth.middleware');

router.use(adminAuthMiddleware);

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

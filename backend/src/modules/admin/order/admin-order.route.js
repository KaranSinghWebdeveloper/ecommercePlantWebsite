const express = require('express');
const router = express.Router();
const adminOrderController = require('./admin-order.controller');
const { adminAuthMiddleware } = require('../../../middleware/auth.middleware');

router.use(adminAuthMiddleware);

router.get('/', adminOrderController.getOrders);
router.get('/:id', adminOrderController.getOrderById);
router.put('/:id/status', adminOrderController.updateOrderStatus);
router.delete('/:id', adminOrderController.deleteOrder);

module.exports = router;

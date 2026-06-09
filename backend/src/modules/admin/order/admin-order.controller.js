const adminOrderService = require('./admin-order.service');

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const result = await adminOrderService.getOrders(parseInt(page), parseInt(limit), status, search);
    res.status(200).json({
      success: true,
      data: result.orders,
      meta: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await adminOrderService.getOrderById(parseInt(id, 10));
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
    
    const order = await adminOrderService.updateOrderStatus(parseInt(id, 10), status, note);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    // We shouldn't physically delete orders for scalability/auditing, but providing endpoint as requested by user's plan.
    await adminOrderService.deleteOrder(parseInt(id, 10));
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};

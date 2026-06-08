const orderService = require('./order.service');

const createOrder = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies['sessionId'];
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID missing' });
    }

    const orderData = req.body;
    const result = await orderService.createOrder(sessionId, orderData);
    
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await orderService.getOrder(orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sessionId = req.headers['x-session-id'] || req.cookies['sessionId'];
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay parameters' });
    }

    await orderService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, sessionId);
    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Payment verification failed' });
  }
};

module.exports = {
  createOrder,
  getOrder,
  verifyPayment
};

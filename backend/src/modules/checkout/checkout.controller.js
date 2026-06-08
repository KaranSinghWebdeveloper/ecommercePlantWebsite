const checkoutService = require('./checkout.service');

const getCheckoutSummary = async (req, res, next) => {
  try {
    const { pincode } = req.body;
    const sessionId = req.headers['x-session-id'] || req.cookies['sessionId'];
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID missing' });
    }

    const summary = await checkoutService.getSummary(sessionId, pincode);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCheckoutSummary
};

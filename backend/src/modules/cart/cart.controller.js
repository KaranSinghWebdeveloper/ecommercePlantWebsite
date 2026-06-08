const cartService = require('./cart.service');

// Middleware can extract session ID from headers or cookies
const getSessionId = (req) => {
  return req.headers['x-session-id'] || req.cookies['sessionId'];
};

const getCart = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) {
      return res.status(200).json({ success: true, data: { items: [], total: 0 } });
    }
    const cart = await cartService.getCart(sessionId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity } = req.body;
    if (!sessionId || !productId) {
      return res.status(400).json({ success: false, message: 'Session ID and Product ID are required' });
    }
    const cart = await cartService.addToCart(sessionId, productId, quantity || 1);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req);
    const cartItemId = parseInt(req.params.id, 10);
    const { quantity } = req.body;
    if (!sessionId || !cartItemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    const cart = await cartService.updateCartItem(sessionId, cartItemId, quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req);
    const cartItemId = parseInt(req.params.id, 10);
    if (!sessionId || !cartItemId) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    const cart = await cartService.removeCartItem(sessionId, cartItemId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../core/response');

/**
 * Admin JWT Auth Middleware
 * Verifies Bearer token from Authorization header OR httpOnly cookie
 */
const adminAuthMiddleware = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Fallback to cookie
    if (!token && req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    if (!token) {
      return errorResponse(res, 401, 'Unauthorized: No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET);

    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
      return errorResponse(res, 403, 'Forbidden: Admin access only');
    }

    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Unauthorized: Token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Unauthorized: Invalid token');
    }
    return errorResponse(res, 401, 'Unauthorized');
  }
};

/**
 * Customer JWT Auth Middleware
 */
const customerAuthMiddleware = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.customerToken) {
      token = req.cookies.customerToken;
    }

    if (!token) {
      return errorResponse(res, 401, 'Unauthorized: No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_CUSTOMER_SECRET || process.env.JWT_SECRET);

    if (!decoded || decoded.role !== 'customer') {
      return errorResponse(res, 403, 'Forbidden: Customer access only');
    }

    req.customer = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Unauthorized: Token expired');
    }
    return errorResponse(res, 401, 'Unauthorized');
  }
};

module.exports = { adminAuthMiddleware, customerAuthMiddleware };

const adminAuthService = require('./admin-auth.service');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('./admin-auth.validation');
const { successResponse } = require('../../../core/response');

/**
 * POST /api/admin/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw error;

    const result = await adminAuthService.login(value.email, value.password);

    // Set httpOnly cookie (optional, for web clients)
    res.cookie('adminToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return successResponse(res, 200, 'Login successful', result);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

/**
 * POST /api/admin/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('adminToken');
    return successResponse(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const admin = await adminAuthService.getProfile(req.admin.id);
    return successResponse(res, 200, 'Profile retrieved', admin);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) throw error;

    const result = await adminAuthService.forgotPassword(value.email);
    return successResponse(res, 200, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) throw error;

    const result = await adminAuthService.resetPassword(value.token, value.password);
    return successResponse(res, 200, result.message);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

/**
 * PUT /api/admin/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) throw error;

    const result = await adminAuthService.changePassword(
      req.admin.id,
      value.currentPassword,
      value.newPassword
    );
    return successResponse(res, 200, result.message);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

module.exports = {
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};

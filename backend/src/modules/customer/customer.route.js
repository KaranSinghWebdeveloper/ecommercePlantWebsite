const express = require('express');
const router = express.Router();
const Joi = require('joi');
const customerService = require('./customer.service');
const { updateProfileSchema, addressSchema } = require('./customer.validation');
const { customerAuthMiddleware } = require('../../middleware/auth.middleware');
const { successResponse } = require('../../core/response');

const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// ─── PUBLIC AUTH ROUTES ───────────────────────────────────────────────────────
router.post('/auth/send-otp', async (req, res, next) => {
  try {
    const { error, value } = sendOtpSchema.validate(req.body);
    if (error) throw error;
    const result = await customerService.sendOtp(value.email);
    return successResponse(res, 200, result.message, { expiresIn: result.expiresIn });
  } catch (err) { next(err); }
});

router.post('/auth/verify-otp', async (req, res, next) => {
  try {
    const { error, value } = verifyOtpSchema.validate(req.body);
    if (error) throw error;
    const result = await customerService.verifyOtp(value.email, value.otp);

    res.cookie('customerToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 200, 'Login successful', result);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('customerToken');
  return successResponse(res, 200, 'Logged out');
});

// ─── PROTECTED PROFILE ROUTES ─────────────────────────────────────────────────
router.get('/profile', customerAuthMiddleware, async (req, res, next) => {
  try {
    const customer = await customerService.getProfile(req.customer.id);
    return successResponse(res, 200, 'Profile retrieved', customer);
  } catch (err) { next(err); }
});

router.put('/profile', customerAuthMiddleware, async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) throw error;
    const customer = await customerService.updateProfile(req.customer.id, value);
    return successResponse(res, 200, 'Profile updated', customer);
  } catch (err) { next(err); }
});

// ─── ADDRESSES ────────────────────────────────────────────────────────────────
router.get('/addresses', customerAuthMiddleware, async (req, res, next) => {
  try {
    const addresses = await customerService.getAddresses(req.customer.id);
    return successResponse(res, 200, 'Addresses retrieved', addresses);
  } catch (err) { next(err); }
});

router.post('/addresses', customerAuthMiddleware, async (req, res, next) => {
  try {
    const { error, value } = addressSchema.validate(req.body);
    if (error) throw error;
    const address = await customerService.addAddress(req.customer.id, value);
    return successResponse(res, 201, 'Address added', address);
  } catch (err) { next(err); }
});

router.put('/addresses/:id', customerAuthMiddleware, async (req, res, next) => {
  try {
    const { error, value } = addressSchema.fork(['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'], (s) => s.optional()).validate(req.body);
    if (error) throw error;
    const address = await customerService.updateAddress(parseInt(req.params.id), req.customer.id, value);
    return successResponse(res, 200, 'Address updated', address);
  } catch (err) { next(err); }
});

router.delete('/addresses/:id', customerAuthMiddleware, async (req, res, next) => {
  try {
    await customerService.deleteAddress(parseInt(req.params.id), req.customer.id);
    return successResponse(res, 200, 'Address deleted');
  } catch (err) { next(err); }
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────
router.get('/orders', customerAuthMiddleware, async (req, res, next) => {
  try {
    const { orders, meta } = await customerService.getOrders(req.customer.id, req.query);
    return successResponse(res, 200, 'Orders retrieved', orders, meta);
  } catch (err) { next(err); }
});

router.get('/orders/:id', customerAuthMiddleware, async (req, res, next) => {
  try {
    const order = await customerService.getOrderById(req.customer.id, parseInt(req.params.id));
    return successResponse(res, 200, 'Order retrieved', order);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
});

module.exports = router;

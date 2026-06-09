const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const customerRepo = require('./customer.repository');
const mailer = require('../../core/mailer');

const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate and send OTP via Email
 */
const sendOtp = async (email) => {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

  // Save to DB
  await customerRepo.saveOtp(email, otp, expiresAt);

  // Dispatch Email
  await mailer.sendEmail({
    to: email,
    subject: 'Your Login OTP - Haryali Plants',
    html: `
      <h2>Login Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
    `,
  });

  // For Dev Only, we also log it so you don't actually need an SMTP setup if testing locally
  console.log(`[DEV OTP] Email: ${email} | OTP: ${otp}`);

  return { message: `OTP sent to ${email}`, expiresIn: OTP_EXPIRY_MINUTES };
};

/**
 * Verify OTP and issue JWT
 */
const verifyOtp = async (email, otp) => {
  const validOtp = await customerRepo.findValidOtp(email, otp);
  
  if (!validOtp) {
    const err = new Error('Invalid or expired OTP');
    err.statusCode = 400;
    throw err;
  }

  // Mark as used
  await customerRepo.markOtpUsed(validOtp.id);

  // Find or create customer
  let customer = await customerRepo.findCustomerByEmail(email);
  if (!customer) {
    customer = await customerRepo.createCustomer({ email });
  }

  // Issue Token
  const payload = {
    id: customer.id,
    email: customer.email,
    role: 'customer'
  };
  const token = jwt.sign(
    payload,
    process.env.JWT_CUSTOMER_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    customer: {
      id: customer.id,
      name: customer.name || '',
      email: customer.email,
      phone: customer.phone || ''
    },
    token
  };
};

/**
 * Get customer profile
 */
const getProfile = async (customerId) => {
  const customer = await customerRepo.findById(customerId);
  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }
  return customer;
};

/**
 * Update customer profile
 */
const updateProfile = async (customerId, data) => {
  return customerRepo.updateProfile(customerId, data);
};

/**
 * Get customer addresses
 */
const getAddresses = async (customerId) => {
  return customerRepo.findAddresses(customerId);
};

/**
 * Add customer address
 */
const addAddress = async (customerId, data) => {
  return customerRepo.createAddress(customerId, data);
};

/**
 * Update customer address
 */
const updateAddress = async (addressId, customerId, data) => {
  return customerRepo.updateAddress(addressId, customerId, data);
};

/**
 * Delete customer address
 */
const deleteAddress = async (addressId, customerId) => {
  return customerRepo.deleteAddress(addressId, customerId);
};

/**
 * Get customer orders
 */
const getOrders = async (customerId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const { items, total } = await customerRepo.findOrders(customerId, { page, limit });

  return {
    orders: items.map((o) => ({
      ...o,
      totalAmount: parseFloat(o.totalAmount),
      subtotal: parseFloat(o.subtotal),
      deliveryCharge: parseFloat(o.deliveryCharge),
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get single customer order
 */
const getOrderById = async (customerId, orderId) => {
  const order = await customerRepo.findOrderById(orderId, customerId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return order;
};

module.exports = {
  sendOtp, verifyOtp, getProfile, updateProfile,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getOrders, getOrderById,
};

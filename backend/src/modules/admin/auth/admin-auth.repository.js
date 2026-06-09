const prisma = require('../../../core/prisma');

/**
 * Find admin user by email
 */
const findByEmail = async (email) => {
  return prisma.adminUser.findUnique({
    where: { email },
  });
};

/**
 * Find admin user by ID
 */
const findById = async (id) => {
  return prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
};

/**
 * Find admin by reset token
 */
const findByResetToken = async (token) => {
  return prisma.adminUser.findUnique({
    where: { resetToken: token },
  });
};

/**
 * Update last login timestamp
 */
const updateLastLogin = async (id) => {
  return prisma.adminUser.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
};

/**
 * Save password reset token
 */
const saveResetToken = async (id, token, expiry) => {
  return prisma.adminUser.update({
    where: { id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
};

/**
 * Reset password and clear token
 */
const resetPassword = async (id, hashedPassword) => {
  return prisma.adminUser.update({
    where: { id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

/**
 * Update admin profile
 */
const updateProfile = async (id, data) => {
  return prisma.adminUser.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });
};

/**
 * Create a new admin user
 */
const create = async (data) => {
  return prisma.adminUser.create({ data });
};

module.exports = {
  findByEmail,
  findById,
  findByResetToken,
  updateLastLogin,
  saveResetToken,
  resetPassword,
  updateProfile,
  create,
};

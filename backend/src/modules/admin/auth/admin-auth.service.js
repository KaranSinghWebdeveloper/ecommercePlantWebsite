const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const adminAuthRepo = require('./admin-auth.repository');

/**
 * Login admin user
 */
const login = async (email, password) => {
  const admin = await adminAuthRepo.findByEmail(email);

  if (!admin || !admin.isActive) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Update last login
  await adminAuthRepo.updateLastLogin(admin.id);

  // Generate JWT
  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1d' }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

/**
 * Get admin profile by ID from token
 */
const getProfile = async (adminId) => {
  const admin = await adminAuthRepo.findById(adminId);
  if (!admin) {
    const err = new Error('Admin not found');
    err.statusCode = 404;
    throw err;
  }
  return admin;
};

/**
 * Forgot password - generate reset token and send email
 */
const forgotPassword = async (email) => {
  const admin = await adminAuthRepo.findByEmail(email);

  // Don't reveal if email exists
  if (!admin) {
    return { message: 'If this email exists, a reset link has been sent' };
  }

  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await adminAuthRepo.saveResetToken(admin.id, resetToken, resetTokenExpiry);

  const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

  // Log in dev mode
  if (process.env.NODE_ENV === 'development') {
    console.log('\n[DEV] Password reset link:', resetUrl, '\n');
  }

  // Try to send email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'HarYali Admin <noreply@haryali.com>',
      to: admin.email,
      subject: 'HarYali Admin — Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Reset Your Password</h2>
          <p>Hello ${admin.name},</p>
          <p>You requested a password reset for your HarYali Admin account.</p>
          <p>Click the button below to reset your password (valid for 1 hour):</p>
          <a href="${resetUrl}" style="display:inline-block; background:#16a34a; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#666; font-size:14px;">Or copy this link: ${resetUrl}</p>
          <p style="color:#666; font-size:14px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('[Email Error]', emailErr.message);
    // Don't fail the request if email fails
  }

  return { message: 'If this email exists, a reset link has been sent' };
};

/**
 * Reset password using token
 */
const resetPassword = async (token, newPassword) => {
  const admin = await adminAuthRepo.findByResetToken(token);

  if (!admin) {
    const err = new Error('Invalid or expired reset token');
    err.statusCode = 400;
    throw err;
  }

  if (!admin.resetTokenExpiry || admin.resetTokenExpiry < new Date()) {
    const err = new Error('Reset token has expired');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await adminAuthRepo.resetPassword(admin.id, hashedPassword);

  return { message: 'Password reset successfully' };
};

/**
 * Change password (authenticated)
 */
const changePassword = async (adminId, currentPassword, newPassword) => {
  const admin = await adminAuthRepo.findByEmail((await adminAuthRepo.findById(adminId)).email);
  // We need raw record with password
  const prisma = require('../../../core/prisma');
  const adminWithPw = await prisma.adminUser.findUnique({ where: { id: adminId } });

  const isValid = await bcrypt.compare(currentPassword, adminWithPw.password);
  if (!isValid) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await adminAuthRepo.updateProfile(adminId, { password: hashed });

  return { message: 'Password changed successfully' };
};

module.exports = {
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};

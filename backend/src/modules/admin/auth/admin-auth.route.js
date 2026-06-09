const express = require('express');
const router = express.Router();
const adminAuthController = require('./admin-auth.controller');
const { adminAuthMiddleware } = require('../../../middleware/auth.middleware');

// Public routes
router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);
router.post('/forgot-password', adminAuthController.forgotPassword);
router.post('/reset-password', adminAuthController.resetPassword);

// Protected routes
router.get('/profile', adminAuthMiddleware, adminAuthController.getProfile);
router.put('/change-password', adminAuthMiddleware, adminAuthController.changePassword);

module.exports = router;

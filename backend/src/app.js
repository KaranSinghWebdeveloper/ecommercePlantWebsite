const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Public Storefront Routes ─────────────────────────────────────────────────
const homeRoutes = require('./modules/home/home.route');
const categoryRoutes = require('./modules/category/category.route');
const productRoutes = require('./modules/product/product.route');
const searchRoutes = require('./modules/search/search.route');
const deliveryRoutes = require('./modules/delivery/delivery.route');
const bannerRoutes = require('./modules/banner/banner.route');
const cartRoutes = require('./modules/cart/cart.route');
const checkoutRoutes = require('./modules/checkout/checkout.route');
const orderRoutes = require('./modules/order/order.route');

// ─── Admin Routes ─────────────────────────────────────────────────────────────
const adminAuthRoutes = require('./modules/admin/auth/admin-auth.route');
const adminOrderRoutes = require('./modules/admin/order/admin-order.route');
const adminCategoryRoutes = require('./modules/admin/category/admin-category.route');
const adminProductRoutes = require('./modules/admin/product/admin-product.route');
const adminSharedRoutes = require('./modules/admin/shared/admin-shared.route');

// ─── Customer Routes ──────────────────────────────────────────────────────────
const customerRoutes = require('./modules/customer/customer.route');

// ─── Public API Endpoints ─────────────────────────────────────────────────────
app.use('/api/home', homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);

// ─── Admin API Endpoints ──────────────────────────────────────────────────────
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin', adminSharedRoutes); // dashboard/stats, banners, delivery/areas, customers

// ─── Customer API Endpoints ───────────────────────────────────────────────────
app.use('/api/customer', customerRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

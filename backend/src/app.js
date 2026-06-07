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

// Modular Routes
const homeRoutes = require('./modules/home/home.route');
const categoryRoutes = require('./modules/category/category.route');
const productRoutes = require('./modules/product/product.route');
const searchRoutes = require('./modules/search/search.route');
const deliveryRoutes = require('./modules/delivery/delivery.route');
const bannerRoutes = require('./modules/banner/banner.route');

// API Endpoints
app.use('/api/home', homeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/banners', bannerRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

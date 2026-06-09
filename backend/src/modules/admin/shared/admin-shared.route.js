const express = require('express');
const router = express.Router();
const { adminAuthMiddleware } = require('../../../middleware/auth.middleware');
const { bannerRepo, deliveryRepo, customerRepo } = require('./admin-shared.repository');
const {
  createBannerSchema, updateBannerSchema,
  createDeliveryAreaSchema, updateDeliveryAreaSchema,
} = require('./admin-shared.validation');
const dashboardService = require('../dashboard/admin-dashboard.service');
const { successResponse } = require('../../../core/response');

router.use(adminAuthMiddleware);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardStats();
    return successResponse(res, 200, 'Dashboard stats retrieved', data);
  } catch (err) { next(err); }
});

// ─── BANNERS ──────────────────────────────────────────────────────────────────
router.get('/banners', async (req, res, next) => {
  try {
    const banners = await bannerRepo.findAll();
    return successResponse(res, 200, 'Banners retrieved', banners);
  } catch (err) { next(err); }
});

router.get('/banners/:id', async (req, res, next) => {
  try {
    const banner = await bannerRepo.findById(parseInt(req.params.id));
    if (!banner) { res.status(404); throw new Error('Banner not found'); }
    return successResponse(res, 200, 'Banner retrieved', banner);
  } catch (err) { next(err); }
});

router.post('/banners', async (req, res, next) => {
  try {
    const { error, value } = createBannerSchema.validate(req.body);
    if (error) throw error;
    const banner = await bannerRepo.create(value);
    return successResponse(res, 201, 'Banner created', banner);
  } catch (err) { next(err); }
});

router.put('/banners/:id', async (req, res, next) => {
  try {
    const { error, value } = updateBannerSchema.validate(req.body);
    if (error) throw error;
    const banner = await bannerRepo.update(parseInt(req.params.id), value);
    return successResponse(res, 200, 'Banner updated', banner);
  } catch (err) { next(err); }
});

router.delete('/banners/:id', async (req, res, next) => {
  try {
    await bannerRepo.remove(parseInt(req.params.id));
    return successResponse(res, 200, 'Banner deleted');
  } catch (err) { next(err); }
});

// ─── DELIVERY AREAS ───────────────────────────────────────────────────────────
router.get('/delivery/areas', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const { items, total } = await deliveryRepo.findAll({ page, limit, search: req.query.search || '' });
    return successResponse(res, 200, 'Delivery areas retrieved', items, { total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.get('/delivery/areas/:id', async (req, res, next) => {
  try {
    const area = await deliveryRepo.findById(parseInt(req.params.id));
    if (!area) { res.status(404); throw new Error('Delivery area not found'); }
    return successResponse(res, 200, 'Delivery area retrieved', area);
  } catch (err) { next(err); }
});

router.post('/delivery/areas', async (req, res, next) => {
  try {
    const { error, value } = createDeliveryAreaSchema.validate(req.body);
    if (error) throw error;

    const exists = await deliveryRepo.findByPincode(value.pincode);
    if (exists) { res.status(409); throw new Error('Pincode already exists'); }

    value.deliveryCharge = parseFloat(value.deliveryCharge);
    value.minOrderForFreeDelivery = parseFloat(value.minOrderForFreeDelivery);

    const area = await deliveryRepo.create(value);
    return successResponse(res, 201, 'Delivery area created', area);
  } catch (err) { next(err); }
});

router.put('/delivery/areas/:id', async (req, res, next) => {
  try {
    const { error, value } = updateDeliveryAreaSchema.validate(req.body);
    if (error) throw error;

    if (value.pincode) {
      const exists = await deliveryRepo.findByPincode(value.pincode, parseInt(req.params.id));
      if (exists) { res.status(409); throw new Error('Pincode already exists'); }
    }

    if (value.deliveryCharge !== undefined) value.deliveryCharge = parseFloat(value.deliveryCharge);
    if (value.minOrderForFreeDelivery !== undefined) value.minOrderForFreeDelivery = parseFloat(value.minOrderForFreeDelivery);

    const area = await deliveryRepo.update(parseInt(req.params.id), value);
    return successResponse(res, 200, 'Delivery area updated', area);
  } catch (err) { next(err); }
});

router.delete('/delivery/areas/:id', async (req, res, next) => {
  try {
    await deliveryRepo.remove(parseInt(req.params.id));
    return successResponse(res, 200, 'Delivery area deleted');
  } catch (err) { next(err); }
});

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
router.get('/customers', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { items, total } = await customerRepo.findAll({ page, limit, search: req.query.search || '' });
    const customers = items.map((c) => ({ ...c, orderCount: c._count.orders, _count: undefined }));
    return successResponse(res, 200, 'Customers retrieved', customers, { total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.get('/customers/:id', async (req, res, next) => {
  try {
    const customer = await customerRepo.findById(parseInt(req.params.id));
    if (!customer) { res.status(404); throw new Error('Customer not found'); }
    return successResponse(res, 200, 'Customer retrieved', { ...customer, orderCount: customer._count.orders, _count: undefined });
  } catch (err) { next(err); }
});

module.exports = router;

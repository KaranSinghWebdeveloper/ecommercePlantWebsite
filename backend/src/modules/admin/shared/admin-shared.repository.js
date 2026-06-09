const prisma = require('../../../core/prisma');

// ─── BANNER REPOSITORY ────────────────────────────────────────────────────────
const bannerRepo = {
  findAll: () => prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } }),
  findById: (id) => prisma.banner.findUnique({ where: { id } }),
  create: (data) => prisma.banner.create({ data }),
  update: (id, data) => prisma.banner.update({ where: { id }, data }),
  remove: (id) => prisma.banner.delete({ where: { id } }),
};

// ─── DELIVERY AREA REPOSITORY ─────────────────────────────────────────────────
const deliveryRepo = {
  findAll: async ({ page = 1, limit = 50, search = '' } = {}) => {
    const where = search ? { OR: [{ name: { contains: search } }, { pincode: { contains: search } }] } : {};
    const [items, total] = await Promise.all([
      prisma.deliveryPoint.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.deliveryPoint.count({ where }),
    ]);
    return { items, total };
  },
  findById: (id) => prisma.deliveryPoint.findUnique({ where: { id } }),
  findByPincode: (pincode, excludeId = null) =>
    prisma.deliveryPoint.findFirst({ where: { pincode, ...(excludeId ? { id: { not: excludeId } } : {}) } }),
  create: (data) => prisma.deliveryPoint.create({ data }),
  update: (id, data) => prisma.deliveryPoint.update({ where: { id }, data }),
  remove: (id) => prisma.deliveryPoint.delete({ where: { id } }),
};

// ─── CUSTOMER REPOSITORY ──────────────────────────────────────────────────────
const customerRepo = {
  findAll: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const where = search
      ? { OR: [{ name: { contains: search } }, { phone: { contains: search } }, { email: { contains: search } }] }
      : {};
    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } },
      }),
      prisma.customer.count({ where }),
    ]);
    return { items, total };
  },
  findById: (id) =>
    prisma.customer.findUnique({
      where: { id },
      include: { addresses: true, _count: { select: { orders: true } } },
    }),
};

module.exports = { bannerRepo, deliveryRepo, customerRepo };

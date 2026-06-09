const prisma = require('../../core/prisma');

// ─── CUSTOMER AUTH REPO ───────────────────────────────────────────────────────
const findCustomerByEmail = async (email) => {
  return prisma.customer.findUnique({ where: { email } });
};

const createCustomer = async (data) => {
  return prisma.customer.create({ data });
};

const findById = async (id) => {
  return prisma.customer.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });
};

const updateProfile = async (id, data) => {
  return prisma.customer.update({ where: { id }, data });
};

// ─── OTP REPO ─────────────────────────────────────────────────────────────────
const saveOtp = async (email, otp, expiresAt) => {
  // Invalidate previous OTPs
  await prisma.customerOtp.updateMany({
    where: { email, used: false },
    data: { used: true },
  });
  return prisma.customerOtp.create({ data: { email, otp, expiresAt } });
};

const findValidOtp = async (email, otp) => {
  return prisma.customerOtp.findFirst({
    where: { email, otp, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
};

const markOtpUsed = async (id) => {
  return prisma.customerOtp.update({ where: { id }, data: { used: true } });
};

// ─── ADDRESS REPO ─────────────────────────────────────────────────────────────
const findAddresses = async (customerId) => {
  return prisma.customerAddress.findMany({
    where: { customerId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
};

const createAddress = async (customerId, data) => {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    return tx.customerAddress.create({ data: { ...data, customerId } });
  });
};

const updateAddress = async (id, customerId, data) => {
  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    return tx.customerAddress.update({ where: { id }, data });
  });
};

const deleteAddress = async (id, customerId) => {
  return prisma.customerAddress.deleteMany({ where: { id, customerId } });
};

// ─── CUSTOMER ORDER REPO ──────────────────────────────────────────────────────
const findOrders = async (customerId, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: { customerId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          select: { id: true, productName: true, productImage: true, quantity: true, unitPrice: true, totalPrice: true },
        },
        deliveryPoint: { select: { name: true, city: true } },
      },
    }),
    prisma.order.count({ where: { customerId } }),
  ]);
  return { items, total };
};

const findOrderById = async (id, customerId) => {
  return prisma.order.findFirst({
    where: { id, customerId },
    include: {
      items: true,
      statusLogs: { orderBy: { createdAt: 'desc' } },
      deliveryPoint: { select: { name: true, city: true } },
    },
  });
};

module.exports = {
  findCustomerByEmail,
  createCustomer,
  findById,
  updateProfile,
  saveOtp,
  findValidOtp,
  markOtpUsed,
  findAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  findOrders,
  findOrderById,
};

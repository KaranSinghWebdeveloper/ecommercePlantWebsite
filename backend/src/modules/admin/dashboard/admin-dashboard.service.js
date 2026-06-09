const prisma = require('../../../core/prisma');

/**
 * Get admin dashboard statistics
 */
const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders,
    totalProducts,
    totalCustomers,
    revenueResult,
    monthRevenueResult,
    lastMonthRevenueResult,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { status: 'active' } }),
    prisma.customer.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'paid' },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'paid', createdAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'paid', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.order.groupBy({
      by: ['orderStatus'],
      _count: { orderStatus: true },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { take: 1 },
        _count: { select: { items: true } },
      },
    }),
  ]);

  const totalRevenue = parseFloat(revenueResult._sum.totalAmount || 0);
  const monthRevenue = parseFloat(monthRevenueResult._sum.totalAmount || 0);
  const lastMonthRevenue = parseFloat(lastMonthRevenueResult._sum.totalAmount || 0);
  const revenueGrowth = lastMonthRevenue > 0
    ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
    : null;

  return {
    stats: {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthRevenue,
      revenueGrowth,
    },
    ordersByStatus: ordersByStatus.reduce((acc, item) => {
      acc[item.orderStatus] = item._count.orderStatus;
      return acc;
    }, {}),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      totalAmount: parseFloat(o.totalAmount),
      orderStatus: o.orderStatus,
      paymentMethod: o.paymentMethod,
      itemCount: o._count.items,
      createdAt: o.createdAt,
    })),
  };
};

module.exports = { getDashboardStats };

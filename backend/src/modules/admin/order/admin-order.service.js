const prisma = require('../../../core/prisma');

const getOrders = async (page = 1, limit = 10, status, search) => {
  const skip = (page - 1) * limit;
  const where = {};
  
  if (status) {
    where.orderStatus = status;
  }
  
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } }
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusLogs: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

const updateOrderStatus = async (id, newStatus, note) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id } });
    if (!order) throw new Error('Order not found');

    const updatedOrder = await tx.order.update({
      where: { id },
      data: { orderStatus: newStatus }
    });

    await tx.orderStatusLog.create({
      data: {
        orderId: id,
        oldStatus: order.orderStatus,
        newStatus,
        note: note || `Status updated to ${newStatus}`
      }
    });

    return updatedOrder;
  });
};

const deleteOrder = async (id) => {
  // Soft delete would be better, but implementing requested functionality
  return await prisma.order.delete({ where: { id } });
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};

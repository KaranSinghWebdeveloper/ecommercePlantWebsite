const prisma = require('../../../core/prisma');

const findAll = async ({ page = 1, limit = 20, search = '', status = '' } = {}) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.name = { contains: search };
  }
  if (status) {
    where.status = status;
  }

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total };
};

const findById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
    },
  });
};

const findBySlug = async (slug, excludeId = null) => {
  return prisma.category.findFirst({
    where: {
      slug,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
};

const create = async (data) => {
  return prisma.category.create({ data });
};

const update = async (id, data) => {
  return prisma.category.update({ where: { id }, data });
};

const remove = async (id) => {
  return prisma.category.delete({ where: { id } });
};

module.exports = { findAll, findById, findBySlug, create, update, remove };

const prisma = require('../../core/prisma');

const getCategories = async () => {
  return prisma.category.findMany({
    where: { status: 'active' },
    orderBy: { id: 'asc' }
  });
};

const getCategoryBySlug = async (slug) => {
  return prisma.category.findUnique({
    where: { slug }
  });
};

module.exports = {
  getCategories,
  getCategoryBySlug
};

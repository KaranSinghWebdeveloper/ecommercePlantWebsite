const categoryRepository = require('./category.repository');

const getCategories = async () => {
  const categories = await categoryRepository.getCategories();
  // Map Prisma _count to a clean productCount field
  return categories.map(({ _count, ...cat }) => ({
    ...cat,
    productCount: _count?.products ?? 0,
  }));
};

const getCategoryBySlug = async (slug) => {
  const category = await categoryRepository.getCategoryBySlug(slug);
  if (!category) {
    const error = new Error('Category not found');
    error.code = 'P2025';
    throw error;
  }
  return category;
};

module.exports = {
  getCategories,
  getCategoryBySlug
};

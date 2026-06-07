const categoryRepository = require('./category.repository');

const getCategories = async () => {
  return await categoryRepository.getCategories();
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

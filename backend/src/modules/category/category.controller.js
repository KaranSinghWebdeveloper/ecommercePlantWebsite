const categoryService = require('./category.service');
const { successResponse } = require('../../core/response');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    return successResponse(res, 200, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    return successResponse(res, 200, 'Category retrieved successfully', category);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug
};

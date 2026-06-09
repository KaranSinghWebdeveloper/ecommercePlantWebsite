const categoryService = require('./admin-category.service');
const { createCategorySchema, updateCategorySchema } = require('./admin-category.validation');
const { successResponse } = require('../../../core/response');

const getCategories = async (req, res, next) => {
  try {
    const { categories, meta } = await categoryService.getCategories(req.query);
    return successResponse(res, 200, 'Categories retrieved', categories, meta);
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const category = await categoryService.getCategoryById(id);
    return successResponse(res, 200, 'Category retrieved', category);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { error, value } = createCategorySchema.validate(req.body);
    if (error) throw error;
    const category = await categoryService.createCategory(value);
    return successResponse(res, 201, 'Category created', category);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { error, value } = updateCategorySchema.validate(req.body);
    if (error) throw error;
    const category = await categoryService.updateCategory(id, value);
    return successResponse(res, 200, 'Category updated', category);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await categoryService.deleteCategory(id);
    return successResponse(res, 200, 'Category deleted');
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };

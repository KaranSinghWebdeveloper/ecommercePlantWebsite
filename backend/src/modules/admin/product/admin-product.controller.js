const productService = require('./admin-product.service');
const { createProductSchema, updateProductSchema } = require('./admin-product.validation');
const { successResponse } = require('../../../core/response');

const getProducts = async (req, res, next) => {
  try {
    const { products, meta } = await productService.getProducts(req.query);
    return successResponse(res, 200, 'Products retrieved', products, meta);
  } catch (err) { next(err); }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(parseInt(req.params.id));
    return successResponse(res, 200, 'Product retrieved', product);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) throw error;
    const product = await productService.createProduct(value);
    return successResponse(res, 201, 'Product created', product);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { error, value } = updateProductSchema.validate(req.body);
    if (error) throw error;
    const product = await productService.updateProduct(parseInt(req.params.id), value);
    return successResponse(res, 200, 'Product updated', product);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(parseInt(req.params.id));
    return successResponse(res, 200, 'Product deleted');
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const addProductImage = async (req, res, next) => {
  try {
    const image = await productService.addProductImage(parseInt(req.params.id), req.body);
    return successResponse(res, 201, 'Image added', image);
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

const removeProductImage = async (req, res, next) => {
  try {
    await productService.removeProductImage(
      parseInt(req.params.id),
      parseInt(req.params.imageId)
    );
    return successResponse(res, 200, 'Image removed');
  } catch (err) {
    if (err.statusCode) res.status(err.statusCode);
    next(err);
  }
};

module.exports = {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  addProductImage, removeProductImage,
};

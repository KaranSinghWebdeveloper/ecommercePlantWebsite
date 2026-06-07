const productService = require('./product.service');
const { getProductsSchema } = require('./product.validation');
const { successResponse } = require('../../core/response');

const getProducts = async (req, res, next) => {
  try {
    const { error, value } = getProductsSchema.validate(req.query);
    if (error) throw error;

    const { products, meta } = await productService.getProducts(value);
    
    return successResponse(res, 200, 'Products retrieved successfully', products, meta);
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    
    return successResponse(res, 200, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug
};

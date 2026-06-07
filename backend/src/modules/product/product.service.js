const productRepository = require('./product.repository');

const getProducts = async (query) => {
  const { page, limit, sort, ...filters } = query;
  
  const { products, totalCount } = await productRepository.getProducts(filters, page, limit, sort);
  
  return {
    products,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

const getProductBySlug = async (slug) => {
  const product = await productRepository.getProductBySlug(slug);
  if (!product) {
    const error = new Error('Product not found');
    error.code = 'P2025'; // Simulating Prisma Not Found
    throw error;
  }
  return product;
};

module.exports = {
  getProducts,
  getProductBySlug
};

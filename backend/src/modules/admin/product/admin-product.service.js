const productRepo = require('./admin-product.repository');

const generateSlug = (name) => {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') +
    '-' +
    Date.now().toString(36)
  );
};

const getProducts = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const { items, total } = await productRepo.findAll({
    page,
    limit,
    search: query.search || '',
    status: query.status || '',
    categoryId: query.categoryId ? parseInt(query.categoryId) : null,
  });

  return {
    products: items.map((p) => ({
      ...p,
      primaryImage: p.images[0]?.imageUrl || null,
      images: undefined,
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getProductById = async (id) => {
  const product = await productRepo.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const createProduct = async (data) => {
  const { images = [], tags = [], ...productData } = data;

  if (!productData.slug) {
    productData.slug = generateSlug(productData.name);
  }

  // Uniqueness checks
  const [slugExists, skuExists] = await Promise.all([
    productRepo.findBySlug(productData.slug),
    productData.sku ? productRepo.findBySku(productData.sku) : null,
  ]);

  if (slugExists) {
    productData.slug = generateSlug(productData.name);
  }
  if (skuExists) {
    const err = new Error('A product with this SKU already exists');
    err.statusCode = 409;
    throw err;
  }

  // Convert price to Decimal-compatible
  productData.price = parseFloat(productData.price);
  if (productData.comparePrice) productData.comparePrice = parseFloat(productData.comparePrice);

  return productRepo.create(productData, images, tags);
};

const updateProduct = async (id, data) => {
  await getProductById(id);

  const { images, tags, ...productData } = data;

  if (productData.slug) {
    const existing = await productRepo.findBySlug(productData.slug, id);
    if (existing) {
      const err = new Error('A product with this slug already exists');
      err.statusCode = 409;
      throw err;
    }
  }
  if (productData.sku) {
    const existing = await productRepo.findBySku(productData.sku, id);
    if (existing) {
      const err = new Error('A product with this SKU already exists');
      err.statusCode = 409;
      throw err;
    }
  }

  if (productData.price) productData.price = parseFloat(productData.price);
  if (productData.comparePrice) productData.comparePrice = parseFloat(productData.comparePrice);

  return productRepo.update(id, productData, images, tags);
};

const deleteProduct = async (id) => {
  await getProductById(id);
  return productRepo.remove(id);
};

const addProductImage = async (productId, imageData) => {
  await getProductById(productId);
  return productRepo.addImage(productId, imageData);
};

const removeProductImage = async (productId, imageId) => {
  await getProductById(productId);
  return productRepo.removeImage(imageId);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
};

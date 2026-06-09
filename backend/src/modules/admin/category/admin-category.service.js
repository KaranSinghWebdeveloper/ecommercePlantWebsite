const categoryRepo = require('./admin-category.repository');

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getCategories = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const { items, total } = await categoryRepo.findAll({
    page,
    limit,
    search: query.search || '',
    status: query.status || '',
  });

  return {
    categories: items.map((c) => ({
      ...c,
      productCount: c._count.products,
      _count: undefined,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCategoryById = async (id) => {
  const category = await categoryRepo.findById(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return { ...category, productCount: category._count.products, _count: undefined };
};

const createCategory = async (data) => {
  // Auto-generate slug if not provided
  if (!data.slug) {
    data.slug = generateSlug(data.name);
  }

  // Check slug uniqueness
  const existing = await categoryRepo.findBySlug(data.slug);
  if (existing) {
    const err = new Error('A category with this slug already exists');
    err.statusCode = 409;
    throw err;
  }

  return categoryRepo.create(data);
};

const updateCategory = async (id, data) => {
  // Verify exists
  await getCategoryById(id);

  if (data.slug) {
    const existing = await categoryRepo.findBySlug(data.slug, id);
    if (existing) {
      const err = new Error('A category with this slug already exists');
      err.statusCode = 409;
      throw err;
    }
  }

  return categoryRepo.update(id, data);
};

const deleteCategory = async (id) => {
  const category = await getCategoryById(id);

  if (category.productCount > 0) {
    const err = new Error(
      `Cannot delete category with ${category.productCount} products. Move or delete products first.`
    );
    err.statusCode = 400;
    throw err;
  }

  return categoryRepo.remove(id);
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

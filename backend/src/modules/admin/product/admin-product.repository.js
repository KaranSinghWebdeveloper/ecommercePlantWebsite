const prisma = require('../../../core/prisma');

const findAll = async ({ page = 1, limit = 20, search = '', status = '', categoryId = null } = {}) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ];
  }
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
};

const findById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      tags: true,
    },
  });
};

const findBySlug = async (slug, excludeId = null) => {
  return prisma.product.findFirst({
    where: {
      slug,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
};

const findBySku = async (sku, excludeId = null) => {
  return prisma.product.findFirst({
    where: {
      sku,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
};

/**
 * Create product with images and tags in a transaction
 */
const create = async (productData, images = [], tags = []) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({ data: productData });

    if (images.length > 0) {
      await tx.productImage.createMany({
        data: images.map((img) => ({ ...img, productId: product.id })),
      });
    }

    if (tags.length > 0) {
      await tx.productTag.createMany({
        data: tags.map((tag) => ({ tag, productId: product.id })),
      });
    }

    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        tags: true,
      },
    });
  });
};

/**
 * Update product with images and tags in a transaction
 */
const update = async (id, productData, images, tags) => {
  return prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { id }, data: productData });

    // Replace images if provided
    if (images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img) => ({ ...img, productId: id })),
        });
      }
    }

    // Replace tags if provided
    if (tags !== undefined) {
      await tx.productTag.deleteMany({ where: { productId: id } });
      if (tags.length > 0) {
        await tx.productTag.createMany({
          data: tags.map((tag) => ({ tag, productId: id })),
        });
      }
    }

    return tx.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        tags: true,
      },
    });
  });
};

const remove = async (id) => {
  return prisma.product.delete({ where: { id } });
};

const addImage = async (productId, imageData) => {
  return prisma.productImage.create({
    data: { ...imageData, productId },
  });
};

const removeImage = async (imageId) => {
  return prisma.productImage.delete({ where: { id: imageId } });
};

module.exports = {
  findAll,
  findById,
  findBySlug,
  findBySku,
  create,
  update,
  remove,
  addImage,
  removeImage,
};

const prisma = require('../../core/prisma');

const buildWhereClause = (filters) => {
  const where = { status: 'active' }; // Only show active products

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { description: { contains: filters.q } },
      { sku: { contains: filters.q } }
    ];
  }

  if (filters.category) {
    where.category = {
      slug: { in: filters.category.split(',') }
    };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  if (filters.stock) {
    if (filters.stock === 'in_stock') {
      where.stockStatus = 'in_stock';
      where.stockAvailable = { gt: 0 };
    } else if (filters.stock === 'low_stock') {
      where.stockStatus = 'in_stock';
      where.stockAvailable = { lte: 10, gt: 0 }; // Example logic for low stock
    } else if (filters.stock === 'out_of_stock') {
      where.OR = [
        { stockStatus: 'out_of_stock' },
        { stockAvailable: { lte: 0 } }
      ];
    }
  }

  // Exact Match Attributes
  ['size', 'location', 'plantType', 'maintenanceLevel', 'sunlightRequirement', 'wateringFrequency'].forEach(attr => {
    if (filters[attr]) {
      where[attr] = { in: filters[attr].split(',') };
    }
  });

  // Booleans
  if (filters.petFriendly !== undefined) where.petFriendly = filters.petFriendly;
  if (filters.potIncluded !== undefined) where.potIncluded = filters.potIncluded;
  if (filters.featured !== undefined) where.featured = filters.featured;
  if (filters.bestSeller !== undefined) where.bestSeller = filters.bestSeller;
  if (filters.newArrival !== undefined) where.newArrival = filters.newArrival;
  
  if (filters.discounted) {
    where.comparePrice = { not: null }; // Proxy for discounted if comparePrice exists
  }

  if (filters.minRating !== undefined) {
    where.ratingAvg = { gte: filters.minRating };
  }

  return where;
};

const buildOrderByClause = (sortOption) => {
  switch (sortOption) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'popular':
      return { reviewsCount: 'desc' };
    case 'rating':
      return { ratingAvg: 'desc' };
    case 'featured':
      return [
        { featured: 'desc' },
        { bestSeller: 'desc' }
      ];
    // Prisma does not support raw SQL expressions in orderBy easily without queryRaw,
    // so sorting by largest discount might require raw query or simplified logic.
    // We'll stick to basic ordering for now or handle it differently if needed.
    case 'discount':
      // Not natively supported directly in orderBy without a stored generated column.
      // Default to newest if discount sort is requested but complex.
      return { createdAt: 'desc' }; 
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
};

const getProducts = async (filters, page, limit, sort) => {
  const where = buildWhereClause(filters);
  const orderBy = buildOrderByClause(sort);
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 }
      }
    }),
    prisma.product.count({ where })
  ]);

  return { products, totalCount };
};

const getProductBySlug = async (slug) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      tags: true,
      reviews: { take: 5, orderBy: { createdAt: 'desc' }, where: { status: 'approved' } }
    }
  });
};

module.exports = {
  getProducts,
  getProductBySlug
};

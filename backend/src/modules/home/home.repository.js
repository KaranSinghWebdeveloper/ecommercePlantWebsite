const prisma = require('../../core/prisma');

const getHomeData = async () => {
  const [banners, categories, featuredProducts, bestSellers, newArrivals] = await Promise.all([
    prisma.banner.findMany({ where: { status: 'active' }, orderBy: { sortOrder: 'asc' } }),
    prisma.category.findMany({ where: { status: 'active' }, orderBy: { id: 'asc' } }),
    prisma.product.findMany({ 
      where: { status: 'active', featured: true }, 
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 8 
    }),
    prisma.product.findMany({ 
      where: { status: 'active', bestSeller: true }, 
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 8 
    }),
    prisma.product.findMany({ 
      where: { status: 'active', newArrival: true }, 
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 8 
    })
  ]);

  return {
    banners,
    categories,
    featuredProducts,
    bestSellers,
    newArrivals
  };
};

module.exports = {
  getHomeData
};

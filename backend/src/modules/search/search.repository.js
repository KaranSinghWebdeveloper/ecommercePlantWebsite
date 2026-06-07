const prisma = require('../../core/prisma');

const getSuggestions = async (query) => {
  if (!query) {
    return { products: [], categories: [] };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: 'active',
        name: { contains: query }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: { where: { isPrimary: true }, take: 1 }
      },
      take: 5
    }),
    prisma.category.findMany({
      where: {
        status: 'active',
        name: { contains: query }
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      take: 3
    })
  ]);

  return { products, categories };
};

module.exports = {
  getSuggestions
};

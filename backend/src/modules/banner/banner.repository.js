const prisma = require('../../core/prisma');

const getBanners = async () => {
  return prisma.banner.findMany({
    where: { status: 'active' },
    orderBy: { sortOrder: 'asc' }
  });
};

module.exports = {
  getBanners
};

const bannerRepository = require('./banner.repository');

const getBanners = async () => {
  return await bannerRepository.getBanners();
};

module.exports = {
  getBanners
};

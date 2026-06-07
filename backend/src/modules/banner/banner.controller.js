const bannerService = require('./banner.service');
const { successResponse } = require('../../core/response');

const getBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getBanners();
    return successResponse(res, 200, 'Banners retrieved successfully', banners);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners
};

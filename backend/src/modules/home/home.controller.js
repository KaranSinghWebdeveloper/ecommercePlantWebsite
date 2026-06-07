const homeService = require('./home.service');
const { successResponse } = require('../../core/response');

const getHomeData = async (req, res, next) => {
  try {
    const data = await homeService.getHomeData();
    return successResponse(res, 200, 'Home data retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomeData
};

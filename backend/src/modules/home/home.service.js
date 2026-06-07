const homeRepository = require('./home.repository');

const getHomeData = async () => {
  return await homeRepository.getHomeData();
};

module.exports = {
  getHomeData
};

const searchRepository = require('./search.repository');

const getSuggestions = async (query) => {
  return await searchRepository.getSuggestions(query);
};

module.exports = {
  getSuggestions
};

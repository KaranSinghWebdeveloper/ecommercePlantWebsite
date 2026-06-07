const searchService = require('./search.service');
const { successResponse } = require('../../core/response');

const getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    const suggestions = await searchService.getSuggestions(q);
    return successResponse(res, 200, 'Suggestions retrieved successfully', suggestions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuggestions
};

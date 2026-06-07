/**
 * Formats a successful response
 * @param {Object} res Express response object
 * @param {Number} statusCode HTTP status code (default: 200)
 * @param {String} message Success message
 * @param {Any} data The response payload
 * @param {Object} meta Pagination or extra metadata
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Formats an error response
 * @param {Object} res Express response object
 * @param {Number} statusCode HTTP status code (default: 500)
 * @param {String} message Error message
 * @param {Any} errors Detailed validation errors or stack trace
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};

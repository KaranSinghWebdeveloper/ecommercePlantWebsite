const { errorResponse } = require('../core/response');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    statusCode = 400; // Bad request for most Prisma errors
    message = 'Database Error';
    if (err.code === 'P2002') {
      message = 'Unique constraint failed';
    }
    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    statusCode = 422;
    message = 'Validation Error';
    errors = err.details.map(detail => ({
      field: detail.context.key,
      message: detail.message
    }));
  }

  if (process.env.NODE_ENV === 'development' && !err.isJoi) {
    errors = err.stack;
  }

  errorResponse(res, statusCode, message, errors);
};

const notFoundHandler = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};

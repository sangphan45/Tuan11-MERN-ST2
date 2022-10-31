const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };
    error.message = err.message;

    // Handling wrong JWT error
    if (err.name === 'JsonWebTokenError') {
      const message = 'Json Web Token is invalid. Try again!!!';
      error = new ErrorHandler(message, 400);
    }

    // Handling Expired JWT error
    if (err.name === 'TokenExpiredError') {
      const message = 'Json Web Token is expired. Try again!!!';
      error = new ErrorHandler(message, 400);
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

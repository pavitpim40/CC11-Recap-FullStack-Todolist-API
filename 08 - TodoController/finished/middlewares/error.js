module.exports = (err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    err.statusCode = 400;
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }
  res.status(err.statusCode || 500).json({
    message: err.message,
    name: err.name,
  });
};

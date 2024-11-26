const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../errors/ErrorResponse");

function errorHandler(err, req, res, next) {
  //for the developer
  console.log(err.stack);

  //mongo bad object id
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid id: ${err.value}`;
    err = new ErrorResponse(message, StatusCodes.NOT_FOUND);
  }

  //mongo duplicate key

  if (err.code === 11000) {
    err.message = "Duplicate field value entered";
    err.statusCode = StatusCodes.BAD_REQUEST;
  }

  //mongo validation error

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    err = new ErrorResponse(message, StatusCodes.BAD_REQUEST);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error-penaldo",
  });
}

module.exports = errorHandler;

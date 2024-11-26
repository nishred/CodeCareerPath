const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../errors/ErrorResponse");

function errorHandler(err, req, res, next) {
  //for the developer



   //mongo bad object id
   if (err.name === "CastError") {
      const message = `Resource not found. Invalid id: ${err.value}`;
      err = new ErrorResponse(message, StatusCodes.NOT_FOUND);
   }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error-penaldo",
  });
}

module.exports = errorHandler;

const asyncHandler = require("../utils/asyncHandler");

const ErrorResponse = require("../errors/ErrorResponse");
const { StatusCodes } = require("http-status-codes");

function authorize(...roles) {
  return asyncHandler((req, res, next) => {
    if (roles.includes(req.user.role)) next();
    else
      throw new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        StatusCodes.UNAUTHORIZED
      );
  });
}

module.exports = authorize




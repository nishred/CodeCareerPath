const jwt = require("jsonwebtoken");
const ErrorResponse = require("../errors/ErrorResponse");
const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const { JWT_SECRET } = require("../config/server.config");
const asyncHandler = require("../utils/asyncHandler");
const userRepository = new UserRepository();
const auth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies.token;
  }

  if (!token) throw new ErrorResponse("Please login", StatusCodes.UNAUTHORIZED);

  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await userRepository.getUserById(decoded.id);

  if (!user) throw new ErrorResponse("Please login", StatusCodes.UNAUTHORIZED);

  req.user = user;

  next();
});

module.exports = auth;

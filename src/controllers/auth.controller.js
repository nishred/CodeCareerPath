const asyncHandler = require("../utils/asyncHandler");

const UserRepository = require("../repositories/user.repository");
const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../errors/ErrorResponse");

const { JWT_COOKIE_EXPIRE, NODE_ENV } = require("../config/server.config");
const { TokenExpiredError } = require("jsonwebtoken");

const userRepository = new UserRepository();

//@desc register a user
//@route POST /api/v1/auth/register
//@access public
const register = asyncHandler(async (req, res, next) => {
  const user = await userRepository.create(req.body);
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (NODE_ENV === "production") options.secure = true;

  res.status(StatusCodes.CREATED).cookie("token", token, options).json({
    success: true,
    message: "User registered successfully",
    token,
  });
});

//@drsc login handler
//@route POST /api/v1/auth/login
//@access public

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password)
    throw new ErrorResponse(
      "Please submit email and password",
      StatusCodes.BAD_REQUEST
    );

  const user = await userRepository.getUserByEmail(email);

  if (!user)
    throw new ErrorResponse("User doesn't exist", StatusCodes.BAD_REQUEST);

  const isMatch = await user.matchPassword(password);

  if (!isMatch)
    throw new ErrorResponse("Password doesn't match", StatusCodes.BAD_REQUEST);

  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (NODE_ENV === "production") options.secure = true;

  res.status(StatusCodes.ACCEPTED).cookie("token", token, options).json({
    success: true,
    token: token,
  });
});

//@desc get current loggedin user
//@route GET /api/v1/auth/me
//@access private

const getLoggedInUser = asyncHandler((req, res, next) => {
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    data: { user: req.user },
  });
});

module.exports = {
  register,
  login,
  getLoggedInUser
};

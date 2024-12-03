const asyncHandler = require("../utils/asyncHandler");

const UserRepository = require("../repositories/user.repository");
const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../errors/ErrorResponse");

const { JWT_COOKIE_EXPIRE, NODE_ENV } = require("../config/server.config");
const { TokenExpiredError } = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto")

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

//@desc forgot password
//@route POST /api/v1/auth/forgotpassword
//@access public

const forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email)
    throw new ErrorResponse("Please submit email", StatusCodes.BAD_REQUEST);

  const user = await userRepository.getUserByEmail(req.body.email);

  if (!user)
    throw new ErrorResponse("User doesn't exist", StatusCodes.BAD_REQUEST);

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  
   console.log("User",user.resetpasswordtoken)

  //req.get("host") will give the host name to which the request was made to
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ErrorResponse(
      "Email could not be sent",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});


//@desc reset password
//@route PUT /api/v1/auth/resetpassword/:resettoken
//@access public

const resetPassword = asyncHandler(async (req, res, next) => {

  const resetpasswordtoken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  console.log(resetpasswordtoken)

  const user = await userRepository.getUserByResetPasswordToken(resetpasswordtoken);

  if (!user) {
    throw new ErrorResponse("Invalid token", StatusCodes.BAD_REQUEST);
  }

  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;

  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Password reset successful",
  });

})


module.exports = {
  register,
  login,
  getLoggedInUser,
  forgotPassword,
  resetPassword
};

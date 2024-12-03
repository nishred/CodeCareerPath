const { UserRepository } = require("../repositories");

const userRepository = new UserRepository();
const asyncHandler = require("../utils/asyncHandler");

const { StatusCodes } = require("http-status-codes");

//@desc get all users
//@route GET /api/v1/users
//@access private/admin

const getAllUsers = asyncHandler(async (req, res, next) => {
  const results = await userRepository.getAll(req.query);

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "Retrieved users successfully",
    data: results,
    error: {},
  });
});

//@desc get single user
//@route GET /api/v1/users/:id
//@access private/admin

const getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await userRepository.getById(id);

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "Retrieved user successfully",
    data: user,
    error: {},
  });
});

//@desc create user
//@route POST /api/v1/users
//@access private/admin

const createUser = asyncHandler(async (req, res, next) => {
  const user = await userRepository.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User created successfully",
    data: user,
    error: {},
  });
});

//@desc delete user
//@route DELETE /api/v1/users/:id
//@access private/admin

const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  await userRepository.delete(id);

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "User deleted successfully",
    data: {},
    error: {},
  });
});

//@desc update user
//@route PUT /api/v1/users/:id
//@access private/admin

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await userRepository.update(req.params.id, req.body);

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "User updated successfully",
    data: user,
    error: {},
  });
});

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};

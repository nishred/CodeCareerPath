const { StatusCodes } = require("http-status-codes");
const { ReviewRepository } = require("../repositories");

const ErrorResponse = require("../errors/ErrorResponse");

const reviewReposiotry = new ReviewRepository();

const asyncHandler = require("../utils/asyncHandler");

//@desc Get all reviews
//@route GET /api/v1/bootcamps/:bootcampId/reviews
//@access public
const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await reviewReposiotry.getAllReviewsByBootcampId(
    req.params.bootcampId,
    req.query
  );

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "Retrieved reviews successfully",
    data: reviews,
    error: {},
  });
});

// @desc get single review
// @route GET /api/v1/reviews/:reviewId
// @access public

const getReview = asyncHandler(async (req, res, next) => {
  const id = req.params.reviewId;

  const review = await reviewReposiotry.getById(id);

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "Review retrieved successfully",
    data: review,
    error: {},
  });
});

//@desc create a review
//@route POST /api/v1/bootcamps/:bootcampId/reviews
//@access private/user

const createReview = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId;

  const userId = req.user._id;

  const review = await reviewReposiotry.create({
    ...req.body,
    bootcamp: bootcampId,
    user: userId,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Review posted successfully",
    data: review,
    error: {},
  });
});

//@desc update a review
//@route PUT /api/v1/reviews/:reviewId
//@access private/user

const updateReview = asyncHandler(async (req, res, next) => {
  const review = await reviewReposiotry.getById(req.params.reviewId);

  if (!review)
    throw new ErrorResponse("Resource not found", StatusCodes.BAD_REQUEST);

  if (review.user.toString() !== req.user._id.toString())
    throw new ErrorResponse(
      "User not authorized to update this resource",
      StatusCodes.UNAUTHORIZED
    );

  const updatedReview = await reviewReposiotry.update(
    req.params.reviewId,
    req.body
  );

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "Review updated successfully",
    data: updatedReview,
    error: {},
  });
});

//@desc delete a review
//@route DELETE /api/v1/reviews/:reviewId
//@access private/user,admin

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await reviewReposiotry.getById(req.params.reviewId);

  if (!review)
    throw new ErrorResponse("Resource not found", StatusCodes.BAD_REQUEST);

  if (
    req.user.role !== "admin" &&
    review.user.toString() !== req.user._id.toString()
  )
    throw new ErrorResponse(
      "User not authorized to update this resource",
      StatusCodes.UNAUTHORIZED
    );

  await reviewReposiotry.delete(req.params.reviewId);

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};

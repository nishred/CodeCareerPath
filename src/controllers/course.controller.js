const { CourseRepository, BootcampRepository } = require("../repositories");

const { StatusCodes } = require("http-status-codes");

const courseRepository = new CourseRepository();

const bootcampRepository = new BootcampRepository();

const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../errors/ErrorResponse");

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access public

const getCourses = asyncHandler(async (req, res, next) => {
  console.log(req.params);

  const courses = await courseRepository.getAllCourses(req.params);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "All Courses",
    count: courses?.length,
    data: courses,
    error: {},
  });
});

//@desc Create a course
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access private
//The owner of the bootcamp should be able to add a course and not anyone else right

const createCourse = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId;

  const bootcamp = await bootcampRepository.getById(bootcampId);

  if (!bootcamp)
    throw new ErrorResponse(
      `Bootcamp with id ${bootcampId} not found`,
      StatusCodes.NOT_FOUND
    );

  if (req.user.role !== "admin" && bootcamp.user.toString() !== req.user._id)
    throw new ErrorResponse(
      "The user doesn't own the bootcamp",
      StatusCodes.UNAUTHORIZED
    );

  req.body.bootcamp = bootcampId;

  req.body.user = bootcamp.user;

  const course = await courseRepository.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Course created successfully",
    data: course,
    error: {},
  });
});

//@desc Update a course
//@route PUT /api/v1/courses/:id
//@access private

const updateCourse = asyncHandler(async (req, res, next) => {
  const response = await courseRepository.update(req.params.id, req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Course updated successfully",
    data: response,
    error: {},
  });
});

//@desc Get a course
//@route GET /api/v1/courses/:id
//@access public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await courseRepository.getById(req.params.id);

  if (!course)
    throw new ErrorResponse(
      `Course with id ${req.params.id} not found`,
      StatusCodes.NOT_FOUND
    );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Retrieved course with id ${req.params.id}`,
    data: course,
    error: {},
  });
});

const removeCourse = asyncHandler(async (req, res, next) => {
  const result = await courseRepository.delete(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Course with id ${req.params.id} deleted successfully`,
    data: {},
    error: {},
  });
});

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  getCourse,
  removeCourse,
};

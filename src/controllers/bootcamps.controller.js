const { StatusCodes } = require("http-status-codes");

const Bootcamp = require("../models/Bootcamp");

const ErrorResponse = require("../errors/ErrorResponse");

const { BootcampRepository } = require("../repositories");
const asyncHandler = require("../utils/asyncHandler");

const geocode = require("../utils/geocode");

const bootcampRepository = new BootcampRepository();

const qs = require("qs");

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
const getAllBootcamps = asyncHandler(async (req, res, next) => {
  const response = await bootcampRepository.getAll(req.query);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Retrieved all bootcamps successfully",
    data: response,
    error: {},
  });
});

//@desc Get bootcamp by id
//@route GET /api/v1/bootcamps/:id
//@access Public
const getBootcampById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const bootcamp = await bootcampRepository.getById(id);

  //objectId is formatted correctly but not found in the database
  if (!bootcamp)
    throw new ErrorResponse(
      `Bootcamp with id ${req.params.id} not found`,
      StatusCodes.NOT_FOUND
    );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Retrieved bootcamp with id ${req.params.id}`,
    data: bootcamp,
    error: {},
  });
});

//@desc Update bootcamp by id
//@route PUT /api/v1/bootcamps/:id
//@access Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const bootcamp = await bootcampRepository.update(id, req.body);

  if (!bootcamp)
    throw new ErrorResponse(
      `Bootcamp with id ${req.params.id} not found`,
      StatusCodes.NOT_FOUND
    );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Bootcamp with id ${req.params.id} updated successfully`,
    data: bootcamp,
    error: {},
  });
});

//@desc Delete bootcamp by id
//@route DELETE /api/v1/bootcamps/:id
//@access Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  await bootcampRepository.delete(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Bootcamp with id ${req.params.id} deleted successfully`,
    data: {},
    error: {},
  });
});

//@desc Add bootcamp
//@route POST /api/v1/bootcamps
//@access Private

const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcampRepository.create(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Bootcamp created successfully",
    data: bootcamp,
    error: {},
  });
});

//@desc Get bootcamps within a radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const result = await geocode(zipcode);

  const coordinates = {
    latitude: result.geometry["lat"],
    longitude: result.geometry["lng"],
  };

  const results = await bootcampRepository.getBootcampsWithinRadius(
    coordinates,
    distance
  );

  res.status(StatusCodes.OK).json({
    success: true,
    count: results.length,
    data: results,
    message: "Bootcamps retrieved successfully",
    error: {},
  });
});

module.exports = {
  getAllBootcamps,
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootcampsInRadius,
};

const { StatusCodes } = require("http-status-codes");

const Bootcamp = require("../models/Bootcamp");

const ErrorResponse = require("../errors/ErrorResponse");

const { BootcampRepository } = require("../repositories");

const bootcampRepository = new BootcampRepository();

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
async function getAllBootcamps(req, res, next) {
  try {
    const bootcamps = await bootcampRepository.getAll();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Retrieved all bootcamps successfully",
      data: { bootcamps, count: bootcamps.length },
      error: {},
    });
  } catch (err) {
    next(err);
  }
}

//@desc Get bootcamp by id
//@route GET /api/v1/bootcamps/:id
//@access Public
async function getBootcampById(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

//@desc Update bootcamp by id
//@route PUT /api/v1/bootcamps/:id
//@access Private
async function updateBootcamp(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

//@desc Delete bootcamp by id
//@route DELETE /api/v1/bootcamps/:id
//@access Private
async function deleteBootcamp(req, res, next) {
  try {
    const bootcamp = await bootcampRepository.delete(req.params.id);  

    if (!bootcamp)
      throw new ErrorResponse(
        `Bootcamp with id ${req.params.id} not found`,
        StatusCodes.NOT_FOUND
      );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Bootcamp with id ${req.params.id} deleted successfully`,
      data: bootcamp,
      error: {},
    });
  } catch (err) {
    next(EvalError);
  }
}

//@desc Add bootcamp
//@route POST /api/v1/bootcamps
//@access Private

async function createBootcamp(req, res, next) {
  try {
    const bootcamp = await bootcampRepository.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Bootcamp created successfully",
      data: bootcamp,
      error: {},
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllBootcamps,
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
};

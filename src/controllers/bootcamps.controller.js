const { StatusCodes } = require("http-status-codes");

const path = require("path");

const Bootcamp = require("../models/Bootcamp");

const ErrorResponse = require("../errors/ErrorResponse");

const { BootcampRepository } = require("../repositories");
const asyncHandler = require("../utils/asyncHandler");

const geocode = require("../utils/geocode");

const bootcampRepository = new BootcampRepository();

const {
  MAX_FILE_UPLOAD,
  FILE_UPLOAD_PATH,
} = require("../config/server.config");
const { isObjectIdOrHexString } = require("mongoose");

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

  console.log(bootcamp)

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

// auth req.user structure
// {

//    _id : new ObjectId("")


// }


const updateBootcamp = asyncHandler(async (req, res, next) => {

  const id = req.params.id;
  const bootcamp = await bootcampRepository.getById(id);


  if (!bootcamp)
    throw new ErrorResponse(
      `Bootcamp with id ${req.params.id} not found`,
      StatusCodes.NOT_FOUND
    );

  if (bootcamp.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ErrorResponse(
      "You're not a authorized to updated this bootcamp",
      StatusCodes.BAD_REQUEST
    );
  }

  const updatedBootcamp = await bootcampRepository.update(id, req.body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Bootcamp with id ${req.params.id} updated successfully`,
    data: updatedBootcamp,
    error: {},
  });
});

//@desc Delete bootcamp by id
//@route DELETE /api/v1/bootcamps/:id
//@access Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const bootcamp = await bootcampRepository.getById(id);

  if (!bootcamp)
    throw new ErrorResponse(
      `Bootcamp with id ${id} doesn't exist`,
      StatusCodes.BAD_REQUEST
    );

  if (req.user.role !== "admin" && req.user._id.toString() !== bootcamp.user.toString())
    throw new ErrorResponse(
      "User doesn't own the bootcamp",
      StatusCodes.BAD_REQUEST
    );

  await bootcampRepository.delete(id);

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
  if (req.user.role === "publisher") {
    const publishedBootcamps = await bootcampRepository.getBootcampsByUser(
      req.user._id
    );

    if (publishedBootcamps.length > 0) {
      throw new ErrorResponse(
        "A publisher can only publish one course",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  const bootcamp = await bootcampRepository.create({
    ...req.body,
    user: req.user._id,
  });

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

// @desc upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private

const uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcampRepository.getById(req.params.id);

  if (!bootcamp) {
    throw new ErrorResponse(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );
  }

  if (!req.files) {
    throw new ErrorResponse(`Please upload a file`, 400);
  }

  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    throw new ErrorResponse(`Please upload an image file`, 400);
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    throw new ErrorResponse(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      400
    );
  }

  console.log("path", path.parse(file.name));

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  //path.parse(file.name) will return an object like this

  // {
  //   root: '',
  //   dir: '',
  //   base: 'Screenshot 2022-12-13 143736.png',
  //   ext: '.png',
  //   name: 'Screenshot 2022-12-13 143736'
  // }

  console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      throw new ErrorResponse(`Problem with file upload`, 500);
    }

    await bootcampRepository.update(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// {
//   "file": {
//     "name": "example.txt",
//     "data": "<Buffer 68 65 6c 6c 6f ...>",
//     "size": 1250,
//     "mimetype": "text/plain"
//   }
// }

module.exports = {
  getAllBootcamps,
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
};

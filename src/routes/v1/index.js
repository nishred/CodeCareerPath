const express = require("express");

const bootcampRouter = require("./bootcamp.routes");

const router = express.Router();

const courseRouter = require("./course.routes");

router.use("/bootcamps", bootcampRouter);

router.use("/courses", courseRouter);

module.exports = router;

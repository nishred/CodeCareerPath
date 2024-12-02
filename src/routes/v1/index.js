const express = require("express");

const bootcampRouter = require("./bootcamp.routes");

const router = express.Router();

const courseRouter = require("./course.routes");

const authRouter = require("./auth.routes");

router.use("/bootcamps", bootcampRouter);

router.use("/courses", courseRouter);

router.use("/auth", authRouter);

module.exports = router;

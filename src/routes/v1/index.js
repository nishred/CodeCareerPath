const express = require("express");

const bootcampRouter = require("./bootcamp.routes");

const router = express.Router();

const courseRouter = require("./course.routes");

const authRouter = require("./auth.routes");

const userRouter = require("./user.routes");

router.use("/bootcamps", bootcampRouter);

router.use("/courses", courseRouter);

router.use("/auth", authRouter);

router.use("/users", userRouter);

module.exports = router;

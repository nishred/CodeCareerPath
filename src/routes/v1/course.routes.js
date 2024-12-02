const express = require("express");

//inherit routes from the parent router
const router = express.Router({ mergeParams: true });

const auth = require("../../middlewares/auth")

const authorize = require("../../middlewares/authorize")

const { CourseController } = require("../../controllers");

router.get("/", CourseController.getCourses);

router.post("/",auth,authorize("admin","publisher"),CourseController.createCourse);

router.put("/:id",auth,authorize("admin","publisher"),CourseController.updateCourse);

router.get("/:id", CourseController.getCourse);

router.delete("/:id",auth,authorize("admin","publisher"),CourseController.removeCourse);

module.exports = router;

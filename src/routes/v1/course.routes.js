const express = require("express");

//inherit routes from the parent router
const router = express.Router({ mergeParams: true });

const { CourseController } = require("../../controllers");

router.get("/", CourseController.getCourses);

router.post("/", CourseController.createCourse);

router.put("/:id", CourseController.updateCourse);

router.get("/:id", CourseController.getCourse);

router.delete("/:id", CourseController.removeCourse);

module.exports = router;

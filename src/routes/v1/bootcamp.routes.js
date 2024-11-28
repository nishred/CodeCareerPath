const express = require("express");

const router = express.Router();


const courseRouter = require("./course.routes");

const { BootcampController } = require("../../controllers");


router.use("/:bootcampId/courses", courseRouter); 

router.get("/", BootcampController.getAllBootcamps);

router.get("/:id", BootcampController.getBootcampById);

router.post("/", BootcampController.createBootcamp);

router.put("/:id", BootcampController.updateBootcamp);

router.delete("/:id", BootcampController.deleteBootcamp);

router.get(
  "/radius/:zipcode/:distance",
  BootcampController.getBootcampsInRadius
);

module.exports = router;

const express = require("express");

const router = express.Router();

const authorize = require("../../middlewares/authorize")


const courseRouter = require("./course.routes");

const reviewRouter = require("./review.routes")

const { BootcampController } = require("../../controllers");

const auth = require("../../middlewares/auth")

router.use("/:bootcampId/courses", courseRouter); 

router.use("/:bootcampId/reviews",reviewRouter)

router.get("/", BootcampController.getAllBootcamps);

router.get("/:id", BootcampController.getBootcampById);

router.post("/",auth,authorize("publisher","admin"),BootcampController.createBootcamp);

router.put("/:id",auth,authorize("publisher","admin"),BootcampController.updateBootcamp);

router.delete("/:id",auth,authorize("publisher","admin"),BootcampController.deleteBootcamp);

router.put("/:id/photo",auth,authorize("publisher","admin"),BootcampController.uploadBootcampPhoto);

router.get(
  "/radius/:zipcode/:distance",
  BootcampController.getBootcampsInRadius
);

module.exports = router;

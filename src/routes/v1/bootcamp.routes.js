const express = require("express")

const router = express.Router()

const {BootcampController} = require("../../controllers")  


router.get("/",BootcampController.getAllBootcamps)

router.get("/:id",BootcampController.getBootcampById)

router.post("/",BootcampController.createBootcamp)

router.put("/:id",BootcampController.updateBootcamp)

router.delete("/:id",BootcampController.deleteBootcamp)


module.exports = router
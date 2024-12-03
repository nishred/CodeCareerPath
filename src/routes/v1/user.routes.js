const express = require("express")


const router = express.Router()
const {UserController} = require("../../controllers")

const auth = require("../../middlewares/auth")

const authorize= require("../../middlewares/authorize")


router.use(auth)

router.use(authorize("admin"))


router.get("/", UserController.getAllUsers)

router.get("/:id", UserController.getUser)

router.post("/", UserController.createUser) 

router.put("/:id", UserController.updateUser)

router.delete("/:id", UserController.deleteUser)    


module.exports = router

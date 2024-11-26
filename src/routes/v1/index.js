const express = require("express")

const bootcampRouter = require("./bootcamp.routes") 

const router = express.Router()


router.use("/bootcamps",bootcampRouter)

module.exports = router
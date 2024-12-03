const express = require("express")

const router = express.Router({mergeParams : true})

const auth = require("../../middlewares/auth")

const authorize = require("../../middlewares/authorize")

const {ReviewController} = require("../../controllers")

router.get("/",ReviewController.getAllReviews)

router.get("/:reviewId",ReviewController.getReview)

router.post("/",auth,authorize("user"),ReviewController.createReview)

router.put("/:reviewId",auth,authorize("user"),ReviewController.updateReview)

router.delete("/:reviewId",auth,authorize("user","admin"),ReviewController.deleteReview)

module.exports = router



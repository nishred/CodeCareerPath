const express = require("express");

const { AuthController } = require("../../controllers");

const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get("/me", auth, AuthController.getLoggedInUser);

module.exports = router;

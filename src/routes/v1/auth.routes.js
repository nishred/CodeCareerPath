const express = require("express");

const { AuthController } = require("../../controllers");

const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get("/me", auth, AuthController.getLoggedInUser);

router.post("/forgotpassword", AuthController.forgotPassword); 

router.put("/resetpassword/:resettoken", AuthController.resetPassword);

router.put("/updatedetails", auth, AuthController.updateDetails);

router.put("/updatepassword", auth, AuthController.updatePassword);

module.exports = router;

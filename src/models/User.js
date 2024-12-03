const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/server.config");

const ErrorResponse = require("../errors/ErrorResponse");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },

  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please add a valid email"],
    unique: true,
  },

  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetpasswordtoken: String,
  resetpasswordexpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//This is an instance method and not a schema/model method
userschema.methods.getSignedJwtToken = function () {
  const token = jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

userschema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userschema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetpasswordtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetpasswordexpire = Date.now() + 10 * 60 * 1000; //10 minutes
  return resetToken;
};

const User = mongoose.model("User", userschema);

module.exports = User;

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Bootcamp = require("./src/models/Bootcamp");
const Course = require("./src/models/Course");

const User = require("./src/models/User");

const Review = require("./src/models/Review");

const { MONGO_URI } = require("./src/config/server.config");

// Load env vars
dotenv.config();

//connect to db
mongoose.connect(MONGO_URI);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);


const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    await Course.create(courses);

    await User.create(users);

    await Review.create(reviews)

    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany()
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

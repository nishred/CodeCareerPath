const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Bootcamp = require("./src/models/Bootcamp");
const Course = require("./src/models/Course");

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

const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);

    await Course.create(courses);

    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany()
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

const mongoose = require("mongoose");
const { MONGO_URI } = require("./server.config");

async function connectDB() {
  await mongoose.connect(MONGO_URI);

  console.log("Connected to DB");
}

module.exports = connectDB;

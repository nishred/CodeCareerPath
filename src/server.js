const express = require("express");
const { StatusCodes } = require("http-status-codes");
const router = require("./routes");
const logger = require("./middlewares/logger");
const { PORT } = require("./config/server.config");
const connectDB = require("./config/db.config");
const errorHandler = require("./utils/errorHandler");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload")
const Bootcamp = require("./models/Bootcamp");

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(express.static(path.join(__dirname,"..","public")));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use("/api", router);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  console.log(`Server started listening on port ${PORT}`);

  await connectDB();
});

//handle unhadled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);

  //close the server and exit the process

  server.close(() => process.exit(1));
});

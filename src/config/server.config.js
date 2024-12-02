const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD,
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  JWT_COOKIE_EXPIRE : process.env.JWT_COOKIE_EXPIRE
};

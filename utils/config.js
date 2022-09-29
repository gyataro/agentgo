require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const GOTENBERG_URL = process.env.GOTENBERG_URL;
const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI,
  GOTENBERG_URL,
  PORT,
  SECRET,
};

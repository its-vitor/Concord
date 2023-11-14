const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

dotenv.config();

function generateToken(userId) {
  if (typeof userId !== "string")
    return jwt.sign({ _id: userId }, process.env.TOKEN, {
      expiresIn: "7d",
    });
  else return jwt.sign({ _id: userId }, process.env.TOKEN, { expiresIn: "7d" });
}

function userFromToken(token) {
  return new mongoose.Types.ObjectId(jwt.decode(token, process.env.TOKEN)._id);
}

module.exports = { generateToken, userFromToken };
const mongoose = require("mongoose");

const User = mongoose.Schema({
  accessToken: { type: String },
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

module.exports = mongoose.model("users", User);

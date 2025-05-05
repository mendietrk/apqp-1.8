const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema
({
    "us1": "String",
    "us2": "String",
    "us3": "String",
    "us4": "String",
    "us5": "String",
    "us6": "Number",
    "us7": "String"
  }
  );

module.exports = mongoose.model("users", UsersSchema);
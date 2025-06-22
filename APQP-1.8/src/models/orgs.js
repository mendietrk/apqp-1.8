const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrgsSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "or2": "String",
    "or3": "String",
    "or4": "String",
    "or5": "String",
    "or6": "String",
    "or7": "String"
  }
  );

module.exports = mongoose.model("orgs", OrgsSchema);
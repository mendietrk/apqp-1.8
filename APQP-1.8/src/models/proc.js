const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProcSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "or2": "String",
    "or3": "String",
    "or4": "String",
    "or5": "String",
    "or7": "String",
    "pg1": "String",
    "pg2": "String",
    "pg3": "String",
    "pg4": "String",
    "pg5": "String",
    "pg6": "String",
    "pg7": "String",
    "pg8": "String",
    "pg9": "String",
    "pg10": "String",
    "pg11": "String",
    "pg12": "String",
    "pg13": "String",
    "pg14": "String",
    "pg15": "String",
    "pg16": "String",
    "pg17": "String"
  }
  
  );

module.exports = mongoose.model("proc", ProcSchema);
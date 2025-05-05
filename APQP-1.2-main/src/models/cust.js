const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "or2": "String",
    "or3": "String",
    "or4": "String",
    "or5": "String",
    "or7": "String",
    "cu1": "String",
    "cu2": "String",
    "cu3": "String",
    "cu4": "String",
    "cu5": "String",
    "cu6": "String",
    "cu7": "String",
    "cu8": "String"
  }
  );

module.exports = mongoose.model("cust", CustSchema);
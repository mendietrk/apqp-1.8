const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MediSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "cu1": "String",
    "pa1": "String",
    "op1": "String",
    "ch1": "String",
    "in1": "String",
    "mt1": "String",
    "mr1": "String",
    "le1": "String",
    "le2": "String",
    "le3": "String",
    "le4": "String",
    "le5": "String",
    "le6": "String",
    "le7": "String",
    "le8": "String"
  }
  );

module.exports = mongoose.model("medi", MediSchema);
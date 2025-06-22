const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fmeaSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "cu1": "String",
    "cu3": "String",
    "pa1": "String",
    "pa2": "String",
    "pa4": "String",    
    "pa6": "String", 
    "pa8": "String",
    "pa9": "String",   
    "pa10": "String",
    "pa11": "String",    
    "op1": "String",
    "op2": "String",
    "op1": "String",
    "fm1": "String",
    "fm2": "String",
    "fm3": "String",
    "fm4": "String",
    "fm5": "String",
    "fm6": "String",
    "fm7": "String",
    "fm8": "String",
    "fm9": "String",
    "fm10": "String",
    "fm11": "String",
    "fm12": "String",
    "fm13": "String"
  }
  );

module.exports = mongoose.model("fmea", fmeaSchema);
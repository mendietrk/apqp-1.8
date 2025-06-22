const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const operSchema = new Schema
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
    "pa1": "String",
    "pa2": "String",
  
    "pa4": "String",
    
    "pa6": "String",
    
    "pa10": "String",
    "pa11": "String",
    
    "op1": "String",
    "op2": "String",
    "op3": "String",
    "op4": "String",
    "op5": "String",
    "op6": "String",
    
  }
  );

module.exports = mongoose.model("oper", operSchema);
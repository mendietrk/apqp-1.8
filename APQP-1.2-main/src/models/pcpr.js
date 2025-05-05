const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pcprSchema = new Schema
({
    "us1": "String",   
    "or2": "String",    
    "cu2": "String",
    "cu3": "String",
    "pa1": "String",
    "pa2": "String",  
    "pa4": "String",
    "pc1": "String",
    "pc2": "String",
    "pc3": "String",
    "pc4": "String",
    "pc5": "String",
    "pc6": "String",
    "pc7": "String",
    "pc8": "String",
    "pc9": "String",
    "pc10": "String",
    "pc11": "String",
    "pc12": "String",
    "pc13": "String",
    "pc14": "String",
    "pc15": "String",
    "pc16": "String",
    "pc17": "String",
    "pc18": "String",
    "pc19": "String"

   
    
  }
  );

module.exports = mongoose.model("pcpr", pcprSchema);
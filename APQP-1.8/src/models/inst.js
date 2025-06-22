const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstSchema = new Schema
({
    "us1": "String",
    "or1": "String",
    "in1": "String",
    "in2": "String",
    "in3": "String",
    "in4": "String",
    "in5": "String",
    "in6": "String",
    "in7": "String",
    "in8": "String",
    "in9": "String",
    "in10": "String",
    "in11": "String",
    "in12": "String",
    "in13": "String",
    "in14": "String"    
  }
  );

module.exports = mongoose.model("inst", InstSchema);
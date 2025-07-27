const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpsSchema = new Schema
({
    id: Number,
    text: String,
    amount: Number
});

module.exports = mongoose.model("exps", ExpsSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  "us1": "String",
    "us2": "String",
    "us3": "String",
    "us4": "String",
    "us5": "String",
    "us6": "Number",
    "us7": "String",
    email: String,
    password: String
});

UsersSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UsersSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', UsersSchema);
const mongoose = require('../db');
require('mongoose-type-email');
const sessionSchema = require('./sessionSchema');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String, //mongoose.SchemaTypes.Email,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: String,
  sessions: [sessionSchema]
});

userSchema.statics.searchFields = ['name', 'email', 'phoneNumber'];

module.exports = userSchema;
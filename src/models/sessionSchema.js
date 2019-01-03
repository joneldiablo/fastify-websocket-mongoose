const mongoose = require('../db');

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  device: String
});

module.exports = sessionSchema;
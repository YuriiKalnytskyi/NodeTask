const { Schema, model } = require('mongoose');

const { dataBaseTablesEnum } = require('../constants');

const userSchema = new Schema({
  avatar: {
    type: String
  },
  activatedStatus: {
    type: Boolean,
    required: true

  },
  authorization_Token: {
    type: String
  },
  photo: [{
    type: String
  }],
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
  },
}, { timestamps: true });

module.exports = model(dataBaseTablesEnum.USER, userSchema);

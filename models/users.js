"use strict";
var mongoose = require('mongoose');

var BoardsSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    match: /^[a-zA-Z0-9 ]{2,15}$/,
    required: true,
    index: { unique: true }
  },
  subscriptions: [{
    type: String,
    match: /^([a-zA-Z0-9 \+\?\*\^\!\#]|\|\||&&){2,100}$/,
    trim: true
  }]
});

var UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    trim: true
  },
  openid: {
    type: String,
    trim: true,
    index: { unique: true }
  },
  joined: {
    type: Date,
    default: new Date()
  },
  boards: [BoardsSchema]
});

module.exports = mongoose.model('users', UserSchema);

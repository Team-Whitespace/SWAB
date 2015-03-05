"use strict";
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
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
  subscriptions: [{
    type: String,
    trim: true
  }]
});

module.exports = mongoose.model('users', UserSchema);

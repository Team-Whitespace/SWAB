"use strict";
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	user: {type: String},
	alerts: {type: [String]}
});

var users = mongoose.model('users', UserSchema);

function addAlert(alert, callback) {
	users.update ({user: "user0"}, {$addToSet: {alerts: alert}}, callback);
}

function getUser(username, callback) {
    return users.findOne({user: username}, callback);
}

function removeAlert(alert) {
	users.update({user: "user0"},
					{$pull: {alerts: alert}});
}

module.exports = {
  addAlert: addAlert,
  getUser: getUser,
  removeAlert: removeAlert
}

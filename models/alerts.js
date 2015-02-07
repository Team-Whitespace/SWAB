"use strict";

var sampleData = require('../data/sampletweets.json')

function addAlert(alert) {
}

function getAlerts() {
    return ["china", "obama", "oil"];
}

function removeAlert(alert) {
}

module.exports = {
  addAlerts: addAlert,
  getAlerts: getAlerts,
  removeAlert: removeAlert
}

"use strict";

var kafka = require('kafka-node');
var conf = require('../config/kafka');

var client = new kafka.Client(conf.client.connectionString, conf.client.clientId,
  conf.client.zkOptions);

var matchConsumer = new kafka.HighLevelConsumer(client, conf.matchConsumer.payloads, conf.matchConsumer.options);
var alertProducer = new kafka.HighLevelProducer(client);

alertProducer.on ('error', onError);
matchConsumer.on ('error', onError);

function addAlert(alert, callback) {
  alertProducer.send([new producerPayload (conf.alertProducer.topic, alert, 'add')], callback);
}

function producerPayload(topic, alert, action) {
  this.topic = topic;
  this.messages = JSON.stringify ({ action: action, alert: alert });
}

function onError(err) {
  if (err) console.log (err);
}

module.exports = {
  matches: matchConsumer,
  addAlert: addAlert
}

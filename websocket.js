"use strict";

var conf = require('./config/kafka');
var kafka = require('kafka-node');

var client = new kafka.Client(conf.zkString);
var consumer = new kafka.HighLevelConsumer(client, conf.payloads.matches);

module.exports = function (io) {
  consumer.on('message', onMatchMessage);
  io.sockets.on('connection', onConnection);

  function onMatchMessage(message) {
    var json_message = JSON.parse(message.value);
    var keywords = json_message.keywords;
    console.log (JSON.stringify (keywords));
    for (var i = 0; i < keywords.length; i++) {
      io.to(keywords[i]).emit(keywords[i], json_message);
    }
  };

  function onConnection(socket) {
    socket.on('join', function onJoin(roomName, callback) {
      socket.join(roomName);
    });
  };
}

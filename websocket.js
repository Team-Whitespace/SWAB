"use strict";

var bask = require('./models/bask.js');

module.exports = function (io) {
  bask.matches.on('message', onConsumerMessage);
  io.sockets.on('connection', onConnection);

  function onConsumerMessage(message) {
    var json_message = JSON.parse(message.value);
    var keywords = json_message.keywords;
    console.log (JSON.stringify (keywords));
    keywords.forEach(function(keyword) {
      io.to(keyword).emit(keyword, json_message);
    });
  };

  function onConnection(socket) {
    socket.on('join', function onJoin(room, callback) {
      socket.join(room, onError);
    });
    socket.on('addAlert', function onAddAlert(alert, callback) {
      bask.addAlert(alert, onError);
    });
  };

  function onError(err) {
    if (err) console.log(err);
  }
}

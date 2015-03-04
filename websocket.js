"use strict";

var matches = require('./models/matches.js');
var users = require('./models/users.js');

module.exports = function (io) {
  matches.matches.on('message', onConsumerMessage);
  io.sockets.on('connection', onConnection);

  function onConsumerMessage(message) {
    var message = JSON.parse(message.value);
    console.log(JSON.stringify(message.matches));
    message.matches.forEach(function(match) {
      io.to(match.queryid).emit(match.queryid, message);
    });
  };

  function onConnection(socket) {
    socket.on('join', function onJoin(room) {
        socket.join(room, onError);
    });

    socket.on('addAlert', function onAddAlert(alert) {
      matches.addAlert(alert, onAddMatchAlert);

      function onAddMatchAlert(err, data) {
        if (err) failedToAddAlert(err);
        else users.addAlert(alert, onAddUserAlert);
      }

      function onAddUserAlert(err) {
        if (err) failedToAddAlert(err);
        else socket.emit('addedAlert', alertMessage(alert, true));
      }

      function failedToAddAlert(err) {
        console.log(err);
        socket.emit('addedAlert', alertMessage(alert, false));
      }

      function alertMessage(alert, success) {
          return {
            success: success,
            alert: alert
          }
      }
    });
  };

  function onError(err) {
    if (err) console.log(err);
  }
}

"use strict";

var matches = require('./models/matches.js');
var users = require('./models/users.js');
var tweets = require('./models/tweets.js');

module.exports = function (io) {
  matches.matches.on('message', onConsumerMessage);
  io.sockets.on('connection', onConnection);

  function onConsumerMessage(message) {
    var message = JSON.parse(message.value);
    message.matches.forEach(function(match) {
      io.to(match.queryid).emit(match.queryid, message);
    });
  };

  function onConnection(socket) {
    socket.on('join', function onJoin(room) {
        socket.join(room, onError);
    });

    socket.on('addBoard', function onAddBoard(board) {
      var userID = socket.request.session.passport.user;

      if (userID) {
        users.findById(userID, function (err, user) {
          var alreadyExists = findOneArray(board, user.boards, 'name');
          if (alreadyExists) {
            //TODO
          } else {
            user.boards.push({ name: board });
            user.save(onAddBoard);
          }
        });
      }

      function onAddBoard(err) {
        if (err) {
          console.log(err);
          socket.emit('addedBoard', { board: board, success: false });
        }
        else socket.emit('addedBoard', { board: board, success: true });
      }
    });

    socket.on('deleteBoard', function onDeleteBoard(data) {
      var userID = socket.request.session.passport.user;

      if (userID) {
        users.findById(userID, function (err, user) {
          user.boards.pull(findOneArray(data, user.boards, 'name'));
          user.save();
        });
      }
    });

    socket.on('addSubscription', function onAddAlert(data) {
      matches.addAlert(data.subscription, onAddMatchAlert);

      function onAddMatchAlert(err, d) {
        var userID = socket.request.session.passport.user;
        if (err || userID === undefined) failedToAddAlert(err);
        else users.findById(userID, function (err, user) {
          if (err || !user) return;
          var board = findOneArray(data.board, user.boards, 'name');
          if (!board) return;
          if (findOneArray(data.subscription, board.subscriptions)) return;
          board.subscriptions.push(data.subscription);
          user.save(onAddUserAlert);
        });
      }

      function onAddUserAlert(err) {
        if (err) failedToAddAlert(err);
        else socket.emit('addedAlert', alertMessage(data.subscription, true));
      }

      function failedToAddAlert(err) {
        console.log(err);
        socket.emit('addedAlert', alertMessage(data.subscription, false));
      }

      function alertMessage(subscription, success) {
        return {
          success: success,
          subscription: subscription
        }
      }
    });

    socket.on('deleteSubscription', function onDeleteSubscription(data) {
      var userID = socket.request.session.passport.user;
      users.findById(userID, function (err, user) {
        if (err || !user) return;
        var board = findOneArray(data.board, user.boards, 'name');
        if (!board) return;
        for (var i = 0, len = board.subscriptions.length; i < len; i++) {
          if (board.subscriptions[i] === data.subscription) {
            board.subscriptions.splice(i, 1);
          }
        }
        user.save();
      });
    });

    socket.on('getTweets', function onGetTweets(data) {
      tweets.search(data.subscription, function(docs, hl) {
        docs.forEach(function (inputTweet, index) {
          docs[index].tweet = JSON.parse(inputTweet.tweet);
          if (hl[inputTweet.id_str].text[0]) {
            docs[index].tweet.text = hl[inputTweet.id_str].text[0];
          }
        });
        socket.emit(data.subscription, docs);
      });
    })
  };

  function onError(err) {
    if (err) console.log(err);
  }

  function findOneArray(needle, haystack, field) {
    return haystack.filter(function (straw) {
      if (field) return straw[field].toUpperCase() == needle.toUpperCase();
      else return straw.toUpperCase() == needle.toUpperCase();
    })[0];
  }
}

"use strict"

var socket = io.connect(location.protocol + '//' + location.host);
var paused = false;
var content = document.getElementById('content');

if (page.alert) getTweets(page.alert);

document.getElementById("subButton").addEventListener("click", sentAlert);
document.getElementById("togglePause").addEventListener("click", togglePauseTweets);

function sentAlert() {
  var text = document.getElementById('alertSub').value;
  var alertList = document.getElementById('alertList');
  socket.emit('addAlert', text);
  alertList.innerHTML =
    '<li>' +
      '<a href="/' + encodeURIComponent(text) + '" >' + text + '</a>' +
    '</li>' +
    alertList.innerHTML;
}


function getTweets(tweet) {
  socket.emit('join', tweet);
  socket.on(tweet, displayTweet);
}

function displayTweet(data) {
  var count = 0;
  var match = data.matches.filter(function isCurrentAlert(obj) {
    return obj.queryid === page.alert;
  })[0];

  if (!match.positions) return;

  match.positions.text.forEach(function highlightTerms(position) {
    data.tweet.text = insertString(data.tweet.text, "<mark>", position.startOffset);
    data.tweet.text = insertString(data.tweet.text, "</mark>", position.endOffset);
  });

  insertTweet(content, data);

  function insertString(str, part, index) {
    var result = str.slice(0, index + count) + part + str.slice(index + count);
    count += part.length;
    return result;
  }
}

function insertTweet(content, data) {
  var style = '';
  if (paused) style = ' style = "display: none"';
  content.insertAdjacentHTML('afterbegin',
    '<div' + style + ' class="tweet" id="tweet-' + data.tweet.id_str + '">' +
      '<div class="tweetContent">'+
        '<p>' + data.tweet.text + '</p>' +
        '<p>' + data.tweet.created_at + '</p>' +
      '</div>' +
      '<div class="tweetInfo">'+
        '<div><img height="40" width="40" src="' + data.tweet.user.profile_image_url + '"></div>' +
        '<div class="tweetUserName">' +
          '<div class="tweetRealName">' +
            data.tweet.user.name +
          '</div>' +
          '<div class="tweetScreenName">' +
            '<a href="http://twitter.com/' + data.tweet.user.screen_name + '">&commat;' +
              data.tweet.user.screen_name +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="clear:both"></div>' +
    '</div>'
  );
}

function togglePauseTweets(e) {
  paused = !paused;

  if (!paused) {
    var tweets = content.getElementsByClassName('tweet')
      for (var i = 0; i < tweets.length; i++) {
        tweets.item(i).style.display = 'block';
      }
  }

  e.stopPropagation();
  e.preventDefault();
}

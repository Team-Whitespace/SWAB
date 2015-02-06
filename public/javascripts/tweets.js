"use strict"

var socket = io.connect(location.protocol + '//' + location.host);

getTweets('oil');

document.getElementById("subButton").addEventListener("click", sentAlert);

function sentAlert() {
  var text = document.getElementById('alertSub').value;
  socket.emit('addAlert', text);
  document.getElementById('alertList').innerHTML =
    '<li>' +
      '<a href="#" >' + text + '</a>' +
    '</li>' +
    document.getElementById('alertList').innerHTML;
}


function getTweets(tweet) {
  socket.emit('join', tweet);
  socket.on(tweet, function displayTweet(data) {
    document.getElementById('content').innerHTML =
      '<div id = "pictureAndName">'+
        '<img src ="' + data.tweet.user.profile_image_url + '">' +
        '<p>' + data.tweet.user.name + '</p>' +
      '</div>' +
      '<div id = "tweetContent">'+
        '<p>' + data.tweet.text + '</p>' +
        '<p>' + data.tweet.created_at + '</p>' +
      '</div>' +
      document.getElementById('content').innerHTML;
  });
}
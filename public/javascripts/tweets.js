"use strict"

var socket = io.connect(location.protocol + '//' + location.host);

getTweets('oil');
getTweets('china');
getTweets('obama');
getTweets('billion');

/*displayTweet({
  tweet: {
    text: "Just put anything that is just a bit longer than \"just put anything\"",
    created_at: "Thu Nov 27 00:45:02 +0000 2014",
    id_str: "537769029864521729",
    user: {
      profile_image_url: "https://gp5.googleusercontent.com/-2RWmMfU0JOI/AAAAAAAAAAI/AAAAAAAAAAA/y6e_4IOxTU0/s48-c-k-no/photo.jpg",
      name: "William Blakey",
      screen_name: "WabAlmighty",
      url: "http://twitter.com/WabAlmighty"
    }
  }
});*/

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
  socket.on(tweet, displayTweet);
}

function displayTweet(data) {
  document.getElementById('content').innerHTML =
    '<div class="tweet" id="tweet-' + data.tweet.id_str + '">' +
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
    '</div>' +
    document.getElementById('content').innerHTML;
};
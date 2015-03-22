"use strict"

var socket                = io.connect(location.protocol + '//' + location.host);
var content               = document.getElementById('content');
var addBoardButton        = document.getElementById('boardNameSubmit');
var addSubscriptionLink   = document.getElementById('addNewSubscription');
var addSubscriptionButton = document.getElementById('addSubscriptionButton');
var addSubscriptionText   = document.getElementById('addSubscriptionText');

if (page.board) init();

function init() {
  page.subscriptions.forEach(function(subscription) {
    addSubscription(subscription);
  });
  addEventListeners();
}

function addEventListeners() {
  addBoardButton.addEventListener('click', addBoard);
  addSubscriptionLink.addEventListener('click', toggleSubscriptionLightbox);
  addSubscriptionButton.addEventListener('click', function(e) {
    addSubscription(e);
    toggleSubscriptionLightbox(e);
  });
}

function toggleSubscriptionLightbox(e) {
  var lightbox = document.getElementById('add-subscription-lightbox');
  if (!lightbox.style.display || lightbox.style.display === 'none') {
    lightbox.style.display = 'flex';
  } else {
    lightbox.style.display = 'none';
  }

  e.stopPropagation();
  e.preventDefault();
}

function addBoard() {
  var text = document.getElementById('boardNameText').value;
  if (isValidBoardName(text)) {
    var boardList = document.getElementById('boardList');
    socket.emit('addBoard', text);
    boardList.insertAdjacentHTML('beforeend',
      '<li>' +
        '<a href="/' + encodeURIComponent(text) + '" >' + text + '</a>' +
      '</li>');
  }
}

function addSubscription(subscription) {
  var paused = false;

  if (!subscription) {
    var subscription = addSubscriptionText.value;
    if (isValidSubscriptionName(subscription)) {
      socket.emit('addSubscription', { board: page.board, subscription: subscription });
    } else return;
  }

  content.insertAdjacentHTML('beforeend',
    '<div draggable="true" class="pane" data-subscription="' + subscription + '">' +
      '<div class="pane-head">' +
        '<h2>' + subscription + '</h2>' +
        '<a class="pause-subscription" href="#">Pause</a>' +
        '<a class="delete-subscription" href="#">Delete</a>' +
      '</div>' +
      '<div class="tweet-container"></div>' +
    '</div>');

  var pane = content.querySelector('[data-subscription="' + subscription + '"]');
  var pauseButton = pane.getElementsByClassName('pause-subscription')[0];
  var deleteButton = pane.getElementsByClassName('delete-subscription')[0];
  var tweetContainer = pane.getElementsByClassName('tweet-container')[0];

  pauseButton.addEventListener('click', function(e) {
    paused = !paused;
    if (paused) pauseButton.innerHTML = "Play";
    else pauseButton.innerHTML = "Pause";
  });

  socket.emit('join', subscription);

  socket.on(subscription, function(data) {
    if (!paused) displayTweet(data, tweetContainer, subscription);
  });
}

function displayTweet(data, pane, subscription) {
  var count = 0;
  var match = data.matches.filter(function isCurrentAlert(obj) {
    return obj.queryid === subscription;
  })[0];

  if (!match.positions) return;

  match.positions.text.forEach(function highlightTerms(position) {
    data.tweet.text = insertString(data.tweet.text, "<mark>", position.startOffset);
    data.tweet.text = insertString(data.tweet.text, "</mark>", position.endOffset);
  });

  insertTweet(pane, data);

  function insertString(str, part, index) {
    var result = str.slice(0, index + count) + part + str.slice(index + count);
    count += part.length;
    return result;
  }
}

function insertTweet(pane, data) {
  if (pane.children.length >= 30) pane.removeChild(pane.children[pane.children.length - 1]);
  pane.insertAdjacentHTML('afterbegin',
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
    '</div>');
}

function isValidBoardName(board) {
  return /^[a-zA-Z0-9 ]{2,15}$/.test(board)
    && document.querySelector('[data-board="' + board + '"]') === null;
}

function isValidSubscriptionName(subscription) {
  return /^([a-zA-Z0-9 \+\?\*\^\!\#]|\|\||&&){2,100}$/.test(subscription)
    && document.querySelector('[data-subscription="' + subscription + '"]') === null;
}

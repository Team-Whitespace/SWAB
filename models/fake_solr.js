"use strict";

var sampleData = require('../data/sampletweets.json')

function getTweets(keyword) {
  var tweets = sampleData[keyword];
  return tweets.statuses;
}

module.exports = {
  getTweets: getTweets
}

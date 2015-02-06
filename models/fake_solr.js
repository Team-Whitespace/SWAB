"use strict";

var sampleData = {
	china: require('../data/china.json'),
	chinese: require('../data/chinese.json'),
	premium: require('../data/premium.json'),
	post: require('../data/post.json'),
	oil: require('../data/oil.json'),
	diamond: require('../data/diamond.json'),
	rio: require('../data/rio.json'),
	streamline: require('../data/streamline.json')
}

function getTweets(keyword) {
	var arrayObj = sampleData[keyword];
  var tweetArray = arrayObj.statuses;
  return tweetArray;
}

module.exports = {
	getTweets: getTweets
}
'use strict';

var sampleData = require('../data/sampletweets.json');
var solr = require('solr-client');
var conf = require('../config/solr');

var client = solr.createClient(conf.client);

function getTweets(keyword) {
  var tweets = sampleData[keyword];
  return tweets.statuses;
}

function search(keyword, callback){
  var query = {
    indent: true,
    q: 'text:' + keyword,
    wt: 'json',
    sort: 'created_at desc',
    start: 0,
    rows: 50
  };

  var request = client.search(query, function (err, obj) {
    if (err) console.log(err);
    else callback(obj.response.docs);
  });

  request.setTimeout(500, function () {
    console.log('Search timed out');
  });

  console.log(request.path);
}

module.exports = {
  getTweets: getTweets,
  search: search
}

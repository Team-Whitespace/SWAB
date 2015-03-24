"use strict";

var sampleData = require('../data/sampletweets.json');
var solr = require('solr-client');
var conf = require('../config/solr');

var client = solr.createClient(conf.client);

function getTweets(keyword) {
  var tweets = sampleData[keyword];
  return tweets.statuses;
}

function search(keyword, callback){
  var request = client.search({
      "indent":"true",
      "q":"text:"+ keyword,
      "wt":"json"}, function (err, obj) {
    if(err){
        console.log(err);
      }else {
        callback(obj.response.docs);
      }
  });
  request.setTimeout(200, function(){
      console.log('search timeout');
  });

}

module.exports = {
  getTweets: getTweets,
  search: search
}
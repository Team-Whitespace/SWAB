var express = require('express');
var users = require('../models/users.js');

var router = express.Router();

/* GET home page. */
router.get(/^\/([a-zA-Z0-9]*)$/, function(req, res, next) {
  users.getUser("user0", function (err, data) {
  	if (err) console.log (err);
    res.render('index', {
      alert: req.params[0],
      subscriptions: data.alerts
    });
  });
});

module.exports = router;

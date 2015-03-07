var express = require('express');
var User = require('../models/users.js');

var router = express.Router();

/* GET home page. */
router.get(/^\/([a-zA-Z0-9%]*)$/, function(req, res, next) {
  res.render('index', {
    alert: req.params[0],
    user: req.user
  });
});

module.exports = router;

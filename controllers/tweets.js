var express = require('express');
var alerts = require('../models/users.js');

var router = express.Router();

/* GET home page. */
router.get(/^\/([a-zA-Z0-9]*)$/, function(req, res, next) {
  res.render('index', {
    alert: req.params[0],
    subscriptions: alerts.getAlerts ()
  })
});

module.exports = router;

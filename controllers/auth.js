var express = require('express');
var passport = require('passport');
var OpenIDStrategy = require('passport-openid');
var router = express.Router();
var User = require('../models/users');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new OpenIDStrategy.Strategy(
  {
    returnURL: 'http://localhost:3000/auth/openid/return',
    realm: 'http://localhost:3000',
    profile: true
  },
  function (identifier, profile, done) {
    User.findOne({ openid: identifier }, function(err, result) {
      if (result) done(err, result);
      else {
        console.log(profile);
        User.create({
          openid: identifier,
          firstname: profile.name.givenName,
          alerts: []
        },
        function (err, result) {
          done(err, result)
        });
      }
    });
  }
));

router.post('/openid/', passport.authenticate('openid'));

router.get('/openid/return', passport.authenticate('openid', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;

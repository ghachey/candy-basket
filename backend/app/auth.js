'use strict';

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var User = require('./models').User;

// The authentication strategy in use is currently HTTP Basic
// Authentication which is not the strongest but good as long as a
// proper TLS connection is setup. More authentication strategies can
// be added using Passport on NodeJS.
passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findByUsername(username, function (err, user) {
      if (err) { return callback(err); }
      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }
        // Password did not match
        if (!isMatch) { return callback(null, false); }
        // Success
        return callback(null, user);
      });
    });
  }
));

// A RESTful API should not typically keeps track of sessions;
// information required to access resources are typically provided on
// each request
exports.isAuthenticated = passport.authenticate('basic', { session : false });

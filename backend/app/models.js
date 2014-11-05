'use strict';

/**
 * NOTE - I've opted not to used an extra level of abstraction for the
 * Candy model. The impedance mismatch between the RESTful API of
 * CouchDB and our JSON Candies in Javascript seems, well, small to
 * non-existant. I may realise some benefits in writing a slim
 * abstraction layer here using a Candy Javascript object with
 * convenient CRUD methods on a CouchDB store but, meh...  I did
 * however started to make use of models with a simple User prototype
 * though it does not store those in CouchDB but just here in a plain
 * array.
 */

var bcrypt = require('bcrypt');

var conf = require('../config');

// DB of users containing a single user
var users = [];

/**
 * @name User
 * @constructor
 * @description A User function object to encapsulate users. Currently
 * only one user is used and not even stored in a DB but persistent
 * down below as an instantiated object in memory.
 *
 * @param {string} username - The User username
 * @param {string} password - The unencrypted password
 */
function User(username, password) {
  this.username = username;
  this.hashedPassword = this.hashPassword(password);
}

/**
 * @function User#verifyPassword
 * @instance
 * @description A User asynchronous function to verify the user
 * password
 *
 * @param {string} password - The unencrypted password
 * @returns {boolean} - true if password matches false otherwise
 */
User.prototype.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.hashedPassword, function(err, res) {
    cb(err, res);
  });
};

/**
 * @function User#hashPassword
 * @instance
 * @description A User synchronous function to hash a given password
 * using the bcrypt password hash algorithm. Asynchronize this if ever
 * users are created regularly as a service. Though by that time
 * something like OAuth might already be in place.
 *
 * @param {string} password - The unencrypted password
 * @returns {string} - bcrypt'ed hash of password
 */
User.prototype.hashPassword = function(password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

/**
 * @function User.findByUsername
 * @static
 * @description 
 * A User static function that looks through a database
 * of users and finds a user by username.
 *
 * @param {string} username - The User's username
 * @param {function} fn - Callback function
 * @returns {function} - callback with null and user args if found and
 * null and null args otherwise
 */
User.findByUsername = function(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

/**
 * @function User.addToDB
 * @static
 * @description A User static function that can asynchronously add
 * users to a private database in this module.
 *
 * @param {User} user - A user object
 * @param {function} fn - Callback function
 * @returns {function} - callback with null and user args if user was
 * added successfully and err and null args otherwise
 */
User.addToDB = function(user, fn) {
  User.findByUsername(user.username, function(err, existingUser) {
    if (existingUser) {
      return fn(new Error('User exists'), null);
    }
    if (!err) {
      users.push(user);
      return fn(null, user);
    }
    return new Error('Should never get here');
  });
};

var candy = new User(conf.backendUser, conf.backendPassword);
users.push(candy);

exports.User = User;

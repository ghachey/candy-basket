'use strict';

/**
 * This contains the controller logic for the website RESTful API.
 * The API is consumed *only* by the website application frontend.
 * 
 * At the moment, code here directly talks to the CouchDB RESTful 
 * API. I may create a tiny abstraction layer in ./models/couchdb.js
 * if I see the benefits.
 */

var nano = require('nano');
var check = require('validator').check;
//var sanitize = require('validator').sanitize;
var iz = require('iz'); 

var conf = require('../../config');

var dbName = conf.dbName;
var couchServer = nano(conf.dbUrl);
var couchdb;

/**
 * @description
 * 
 * Private function to validate candies before attempting to save them
 * to CouchDB.  Further validation on a Candy should be added
 * here. Make use of a combination of two validation libraries:
 * validator with more sophisticated string check and validations and
 * iz with stronger support for other data type checks
 *
 * @param {Object} candy A candy Javascript object
 * @return {Boolean} returns true only if all properties validate
 */
var validateCandy = function(candy) {

  var urlOptions;
  /* jshint ignore:start */
  // Forced to not comply with my Lint conventions due to third party, so ignore it.
  urlOptions = { 
    protocols: ['http','https','ftp'], 
    require_tld: false, 
    require_protocol: false, 
    allow_underscores: false 
  };
  /* jshint ignore:end */

  if (!check.isURL(candy.source, urlOptions)) {return false;}
  if (candy.title === undefined) {return false;}
  if (candy.description === undefined) {return false;}

  if (candy.attachmentFilename && !check.isBase64(candy.attachment)) {
    return false;
  }

  if (candy.tags && !iz.ofType(candy.tags, 'array')) {
    return false;
  }
  
  return true; // Eventually could return an error of why it did not validate
};

var getMeta = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var createCandy = function(req, res) {
  console.log('TEST: ', req);
  if (validateCandy(req)) {
    // Try creating
    res.send(200);
  } else {
    res.send(400);
  }
};

var getCandy = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var updateCandy = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var deleteCandy = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var getCandies = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var getTags = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var getTagsByCandies = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var serve404 = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

exports.dbName = dbName;
exports.couchServer = couchServer;
exports.couchdb = couchdb;

exports.getMeta = getMeta;
exports.createCandy = createCandy;
exports.getCandy = getCandy;
exports.updateCandy = updateCandy;
exports.deleteCandy = deleteCandy;
exports.getCandies = getCandies;
exports.getTags = getTags;
exports.getTagsByCandies = getTagsByCandies;
exports.serve404 = serve404;

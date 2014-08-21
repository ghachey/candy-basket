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
var validator = require('validator');
//var iz = require('iz'); 

var conf = require('../../config');

var dbName = conf.dbName;
var couchServer = nano(conf.dbUrl); //nano
var couchdb = couchServer.db.use(dbName);

/**
 * @description
 * 
 * Private function to validate candies before attempting to save them
 * to CouchDB.  Further validation on a Candy should be added
 * here. Make use of a combination of two validation libraries:
 * validator with more sophisticated string check and validations and
 * iz with stronger support for other data type checks
 *
 * TODO - Push this functionality as a middleware passed as additional callback
 * to routes?!?!
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

  if (!validator.isURL(candy.source, urlOptions)) {return {'status': false, 
                                                           'err': 'Bad source'};}
  if (candy.title === undefined) {return {'status': false, 'err': 'No title'};}
  if (candy.description === undefined) {return {'status': false, 
                                                'err': 'No description'};}
  if ((candy.attachmentFilename && candy.attachment && 
      validator.isBase64(candy.attachment)) ||
     (!candy.attachmentFilename && !candy.attachment)) {
    // We've got both the filename and the file itself and the file is properly encoded
    // in base64, we're good
    // or
    // We don't have any filename or attachment at all, we're still good
  } else {
    return {'status': false, 'err': 'Bad attachment'};
  }
  if (!Array.isArray(candy.tags)) {return {'status': false, 'err': 'Tags not an array'};}

  return {'status': true, 'err': 'Data Valid'}; 
};

var getMeta = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var createCandy = function(req, res) {
  console.log('Body: ', req.body);
  if (validateCandy(req.body).status) {
    couchdb.insert(req.body, function(err, body) {
      if (!err) {
        res.send(201);
        console.log('Insert success response: ', body);
      } else {
        console.log('Error inserting document: ', err);
        res.send(500, err);
      }
    });
  } else {
    console.error('Validation error: ', validateCandy(req.body).err);
    res.send(400, validateCandy(req.body).err);
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

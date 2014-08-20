'use strict';

/**
 * NOTE - Not currently using this extra level of abstraction.
 *
 * Extremely thin layer to talk with the CouchDB store.
 *
 * At the moment, code here directly talks to the CouchDB RESTful 
 * API. I may create a tiny abstraction layer in ./models/couchdb.js
 * if I see the benefits.
 */

var conf = require('../../config');
var nano = require('nano');

var dbName = conf.dbName;
var couchServer = nano(conf.dbUrl);
var couchdb;


//couchdb = couchServer.db.use(dbName);

// Maybe define a Javascript object for candies with CRUD methods over a CouchDB
// backend...

exports.dbName = dbName;
exports.couchServer = couchServer;
exports.couchdb = couchdb;

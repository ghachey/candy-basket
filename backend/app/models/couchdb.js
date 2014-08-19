'use strict';

/**
 * Extremely thin layer to talk with the CouchDB store
 */

var conf = require('../../config');
var nano = require('nano')(conf.dbUrl);
var utils = require('../utils');

var couchdbDb = conf.dbName;
var couchdb = nano.db.use(couchdbDb);

/**
 * @description
 *
 * Generic function to retrieve documents from CouchDB.
 *
 * @param {String} couchDoc The couch document to retrieve
 */
var getFromCouch = function(couchDoc, callback){

  couchdb.get(couchDoc, function(err, body) {
    if (err) {
      console.error('Error retrieving document from CouchDB: ', err);
      callback(err, {});
    } else {
      console.log('Retrieving document from CouchDB: ', body);
      callback(err, body);
    }    
  });

};

exports.getFromCouch = getFromCouch;

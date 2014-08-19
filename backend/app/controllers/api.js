'use strict';

/**
 * This contains the controller logic for the website RESTful API.
 * The API is consumed *only* by the website application frontend.
 */

var db = require('../models/couchdb');

var getDocument = function(req, res){

  var uriSegments = req.route.path.split('/');
  // uriSegments[0] is always '' and is discarded
  // uriSegments[1] is always 'api' and is also discarded
  var locale = uriSegments[2];
  var docUrlParts = uriSegments.slice(3, uriSegments.length);
  if (docUrlParts[0] === '') {docUrlParts[0] = 'home';}
  var docUrl = 'base.' + docUrlParts.join('.') + '.' + locale;
  
  console.log('docUrl: ', docUrl);

  db.getFromCouch(docUrl, function(err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send(500);
    }
  });

};

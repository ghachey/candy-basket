'use strict';

/**
 * This contains the controller logic for the website RESTful API.
 * The API is consumed *only* by the website application frontend.
 * 
 * At the moment, code here directly talks to the CouchDB RESTful 
 * API.
 * 
 * @see ./models.js for more details
 */

var async = require('async');
var nano = require('nano');
var validator = require('validator');
var sanitizer = require('sanitizer');

var conf = require('../config');

var dbName = conf.dbName;
var couchServer = nano(conf.dbUrl); //nano
var couchdb = couchServer.db.use(dbName);

/**
 * @description
 * 
 * Private function to validate candies before attempting to save them
 * to CouchDB.  Further validation on a Candy should be added
 * here. Make use of a combination of validation and sanitization libraries:
 * validator with more sophisticated string check and validations and
 * sanitize-html as flexible user submitted HTML cleanup
 *
 * TODO - Push this functionality as a middleware passed as additional callback
 * to routes?!?! I don't see the benefit in further developing this now though
 *
 * @param {Object} candy A candy Javascript object
 * @return {Object} an Object with keys for valid status, message,
 * cleaned up description field
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

  if (candy._id && !validator.matches(candy._id, /[0-9a-f]{32}/)) {
    return {'status': false, 'msg': 'Bad uuid'};
  }

  if (!validator.isURL(candy.source, urlOptions)) {return {'status': false, 
                                                           'msg': 'Bad source'};}
  if (candy.title === undefined) {return {'status': false, 'msg': 'No title'};}
  if (candy.description === undefined) {return {'status': false, 
                                                'msg': 'No description'};}
  if ((candy.attachmentFilename && candy.attachment && 
      validator.isBase64(candy.attachment)) ||
     (!candy.attachmentFilename && !candy.attachment)) {
    // We've got both the filename and the file itself and the file is properly encoded
    // in base64, we're good
    // or
    // We don't have any filename or attachment at all, we're still good
  } else {
    return {'status': false, 'msg': 'Bad attachment'};
  }
  if (!Array.isArray(candy.tags)) {return {'status': false, 'msg': 'Tags not an array'};}

  // Sanitize user submitted HTML to your taste here, 
  // see https://www.npmjs.org/package/sanitizer
  var cleaned = sanitizer.sanitize(candy.description);

  return {'status': true, 'msg': 'Data Valid', 'description': cleaned}; 
};

var getMeta = function(req, res) {
  res.send({'name': 'Candy Basket', 'version': 0.3});
};

var createCandy = function(req, res) {
  console.log('Body: ', req.body);

  if (validateCandy(req.body).status) {
    req.body.description = validateCandy(req.body).description;
    req.body.date = new Date().toJSON();
    req.body.private = false;

    couchdb.insert(req.body, function(err, body) {
      if (!err) {
        res.set('Location', body.id); // Set Location header to resource ID (couch ID)
        res.send(201);
        console.log('Insert success response: ', body);
      } else {
        console.log('Error inserting document: ', err);
        res.send(500, err);
      }
    });

  } else {
    console.error('Validation error: ', validateCandy(req.body).msg);
    res.send(400, validateCandy(req.body).msg);
  }
};

var getCandy = function(req, res) {
  var uuid = req.params.uuid;

  couchdb.get(uuid, function(err, body) {
    if (!err) {
      res.send(body);
    } else {
      /* jshint ignore:start */
      // CouchDB response not inline with my JS conventions
      res.send(err.status_code, err);
      /* jshint ignore:end */
    }
  });
  
};

/**
 * Updating CouchDB document correctly should following the following algortihm:
 *
 *   (1) Get document
 *   (2) Save the _rev
 *   (3) Apply changes
 *   (4) Try to send updated document with saved _rev
 *   (5) Go to step (1) in case of a 409
 */
var updateCandy = function(req, res) {
  var uuid = req.params.uuid;
  var rev;
  var createdDate;

  // No point going further if data to update do not validate
  if (validateCandy(req.body).status) { 

    async.series([
      function(callback){
        // Get document (rev)
        couchdb.get(uuid, function(err, body) {
          if (!err) {
            // Save rev
            rev = body._rev;
            createdDate = body.date;
            callback(null);
          } else {
            // Do I need to run callback(err) or does res.send the err sufficient?
            // Any memory implications?
            /* jshint ignore:start */
            // CouchDB response not inline with my JS conventions
            res.send(err.status_code, err);
            /* jshint ignore:end */
            callback(err);
          }
        });
      },
      function(callback){
        // Apply changes
        req.body.description = validateCandy(req.body).description;
        req.body._rev = rev;
        req.body.date = createdDate; // Date created remains unchanged for now
        req.body.private = false;
        // Try sending updates
        couchdb.insert(req.body, function(err, body) {
          if (!err) {
            // Do I need to call callback(null);
            res.set('Location', body.id); // Set Location header to resource ID (couch ID)
            res.send(200);
            console.log('Insert success response: ', body);
            callback(null);
          } else if (err.status === 409) { // Update conflict, try again
            // Try again, not yet implemented, will be important when many users
            // using service in higher latency context
          } else  {
            console.log('Error inserting document: ', err);
            res.send(500, err);
            callback(err);
          }
        });
      }
    ]);

  } else {
    console.error('Validation error: ', validateCandy(req.body).msg);
    res.send(400, validateCandy(req.body).msg);
  }
};

var deleteCandy = function(req, res) {
  var uuid = req.params.uuid;
  var rev;

  async.series([
    function(callback){
      // Get document (rev)
      couchdb.get(uuid, function(err, body) {
        if (!err) {
          // Save rev
          rev = body._rev;
          callback(null);
        } else {
          // Do I need to run callback(err) or does res.send the err sufficient?
          // Any memory implications?
          /* jshint ignore:start */
          // CouchDB response not inline with my JS conventions
          res.send(err.status_code, err);
          /* jshint ignore:end */
          callback(err);
        }
      });
    },
    function(callback){
      // Destroy
      couchdb.destroy(uuid, rev, function(err, body) {
        if (!err) {
          // Do I need to call callback(null);
          res.send(200);
          console.log('Delete success response: ', body);
          callback(null);
        } else  {
          console.log('Error deleting document: ', err);
          res.send(500, err);
          callback(err);
        }
      });
    }
  ]);

};

/**
 * @description
 * 
 * Gets JSON view from CouchDB, mash it up and return it as
 * desired. Here, the list of candies is not returned as a direct
 * JSON array for security reasons. Flask's jsonify handles this
 * automatically by forcing a hash structure in the response. This
 * security risk is explained in detail at
 * http://flask.pocoo.org/docs/security/#json-security.
 *
 * There is one issue with this: typical RESTful service consumers
 * (angularjs in this case) expect a straight array on queries
 * (i.e. GETs). However, AngularJS provides a tranformsResponse hook
 * to deal with this easily.
 */
var getCandies = function(req, res) {
  var docs = [];
  var tags;

  couchdb.view('docs', 'candies_by_id', function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        tags = doc.value.tags ? doc.value.tags : [];
        var docData = {
          '_id': doc.value._id,
          'source': doc.value.source,
          'title': doc.value.title,
          'description': doc.value.description,
          'tags': tags.map(function(tag) {return tag.toLowerCase();}),
          'date': doc.value.date,
          'private': doc.value.private
        };
        docs.push(docData);
      });
      res.send(200, {'candies_by_id' : docs});
    } else {
      console.error('Error getting view: ', err);
      /* jshint ignore:start */
      res.send(err.status_code, err);
      /* jshint ignore:end */
    }
  });

};

/**
 * Gets a list of tags (with their counts) for use in the frontend
 * autocomplete and tag cloud features. Returns it in a convenient way
 * for use in Angular. This is a reduced version of getTagsByCandies
 * and I don't think it is used anymore though it does not hurt to leave it here.
 */
var getTags = function(req, res) {
  var tags = [];
  var tagsCounts = [];
  var viewData;

  couchdb.view('docs', 'tags_with_counts?group=True', function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        tags.push(doc.key);
        tagsCounts.push({'word': doc.key, 'count': doc.value});
      });
      /* jshint ignore:start */
      viewData = {'tags' : {'tags': tags, 'tagsCounts': tagsCounts}};
      /* jshint ignore:end */
      res.send(200, viewData);
    } else {
      console.error('Error getting view: ', err);
      /* jshint ignore:start */
      res.send(err.status_code, err);
      /* jshint ignore:end */
    }
  });

};

/** 
 * Gets a list of candies and their tags for use in the frontend
 * autocomplete and tag cloud features. Getting an unreduce version will
 * make it easier to have dynamic computation on the frontend
 * (e.g. dynamic tags cloud) Returns it in a convenient way for use in
 * Angular.  
 */
var getTagsByCandies = function(req, res) {
  var tags = [];
  var viewData;

  couchdb.view('docs', 'tags_by_candy_id', function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        tags.push({
          'candy_id': doc.key[0],
          'date': doc.key[1],
          'tag': doc.value.map(function(tag) {return tag.toLowerCase();})
        });
      });
      viewData = {'tagsByCandies' : {'tagsByCandies': tags}};
      res.send(200, viewData);
    } else {
      console.error('Error getting view: ', err);
      /* jshint ignore:start */
      res.send(err.status_code, err);
      /* jshint ignore:end */
    }
  });
 
};

var serve404 = function(req, res) {
  res.send(404);
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

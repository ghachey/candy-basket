'use strict';

/**
 * This contains the controller logic for the website RESTful API.
 * The API is consumed *only* by the website application frontend. The
 * backend implementation is actually quite simple and most of the
 * work is done here. There is an Express route defined for each of
 * the REST end point {@link
 * nasaraCandyBasketBackend.app}. `backend/app/app.js` implemented as
 * Javascript async functions right here. Interaction with the CouchDB
 * persistent store is done inside those functions.
 *
 * Data validation is also done right here. It does basic checks on
 * all fields and HTML sanitization before approving and sending to
 * persist in CouchDB.
 *
 * @see ./models.js for more details
 */

var async = require('async');
var nano = require('nano');
var validator = require('validator');
var sanitizer = require('sanitizer');
var request = require('superagent');
var path = require('path');
var fs = require('fs');
/* jshint ignore:start */
var multimethod = require('multimethod');
/* jshint ignore:end */
var mmm = require('mmmagic');

var conf = require('../config');

var Magic = mmm.Magic;

var dbName = conf.dbName;
var couchServer = nano(conf.dbUrl); //nano
var couchdb = couchServer.db.use(dbName);

var ownCloudServer = conf.webdavServer.protocol + '://' + conf.webdavServer.host;
var ownCloudShare = conf.webdavFileLocation;
var ownCloudUser = conf.webdavServer.username;
var ownCloudPassword = conf.webdavServer.password;
var ownCloudCA = conf.webdavServer.ca;

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
  // Forced to not comply with my Lint conventions due to third party,
  // so ignore it.
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
    // We've got both the filename and the file itself and the file is
    // properly encoded in base64, we're good or We don't have any
    // filename or attachment at all, we're still good
  } else {
    return {'status': false, 'msg': 'Bad attachment'};
  }
  if (!Array.isArray(candy.tags)) {
    return {'status': false, 'msg': 'Tags not an array'};
  }

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
        res.status(201).end();
        console.log('Insert success response: ', body);
      } else {
        console.log('Error inserting document: ', err);
        res.status(500).send(err);
      }
    });

  } else {
    console.error('Validation error: ', validateCandy(req.body).msg);
    res.status(400).send(validateCandy(req.body).msg);
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
      res.status(err.status_code).send(err);
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
            res.status(err.status_code).send(err);
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
            // Set Location header to resource ID (couch ID)
            res.set('Location', body.id); 
            res.status(200).end();
            console.log('Insert success response: ', body);
            callback(null);
          } else if (err.status === 409) { // Update conflict, try again
            // Try again, not yet implemented, will be important when many users
            // using service in higher latency context
          } else  {
            console.log('Error inserting document: ', err);
            res.status(500).send(err);
            callback(err);
          }
        });
      }
    ]);

  } else {
    console.error('Validation error: ', validateCandy(req.body).msg);
    res.status(400).send(validateCandy(req.body).msg);
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
          res.status(err.status_code).send(err);
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
          res.status(200).end();
          console.log('Delete success response: ', body);
          callback(null);
        } else  {
          console.log('Error deleting document: ', err);
          res.status(500).send(err);
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
      res.status(200).send({'candiesById' : docs});
    } else {
      console.error('Error getting view: ', err);
      /* jshint ignore:start */
      res.status(err.status_code).send(err);
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
      res.status(200).send(viewData);
    } else {
      console.error('Error getting view: ', err);
      /* jshint ignore:start */
      res.status(err.status_code).send(err);
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
      res.status(200).send(viewData);
    } else {
      console.error('Error getting view: ', err);
      /* jshint ignore:start */
      res.status(err.status_code).send(err);
      /* jshint ignore:end */
    }
  });
  
};

/**
 * @name nasaraCandyBasketBackend.controllers:_ownCloudRequestCallback
 * @description
 * @private
 *
 * Callback handler for requests to ownCloud WebDAV server used by
 * private multimethod {@link
 * nasaraCandyBasketBackend.controllers:_sendToOwnCloud}.
 */
/* jshint ignore:start */
var _ownCloudRequestCallback = function(ownCloudErr, ownCloudRes) {
  if (ownCloudErr) {
    console.error('Error uploading to ownCloud: ', ownCloudErr);
    return {'status': 503, 'body': ownCloudErr};
  } else {
    console.log('Successful upload to ownCloud: ', ownCloudRes.status);
    return {'status': 200, 'body': ownCloudRes};
  }
};
/* jshint ignore:end */

/**
 * @name nasaraCandyBasketBackend.controllers:_sendToOwnCloud
 * @description
 * @private
 *
 * A private function to handle sending files to ownCloud. It is
 * abstracted here because of the intricacies I faced when dealing
 * with this as an inexperienced person on the subject. In short, I
 * could never get it to work properly using only sending via
 * multipart requests. It would only work on non-image files
 * (corrupting images). This is either because the Sabre WebDAV server
 * of ownCloud did not understand how to process those or I was doing
 * something wrong (though I could get it to work on my own test
 * backends).
 * 
 * After days of frustration I finally opted to send images not as
 * multipart request but as plain buffered binary data setting my own
 * headers. All other files seem to work as multipart request though I
 * only really tested with PDF making this later statement a bit over
 * confident.
 *
 * While I'm at it, might as well try out this cool multimethod lib to
 * dispatch appropriate behavior instead of Javascript's classical
 * prototype based polymorphism. If we find out we need to send files
 * to ownCloud differently based on files then it will be easy to add
 * polymorphic behavior :)
 *
 * Used only by {@link nasaraCandyBasketBackend.controllers:uploadFile}.
 */
/* jshint ignore:start */
var _sendToOwnCloud = multimethod()
      .dispatch(function(file, fileType, fileMime) {
        return fileType;
      })
      .when("image", function(file, fileType, fileMime) {
        fs.readFile(file.path, function(err, data){
          request
            .put(ownCloudServer + ownCloudShare + file.name)
            .ca(ownCloudCA)
            .auth(ownCloudUser, ownCloudPassword)
            .set('Content-Type', fileType)
            .set('Content-Disposition', 'attachment; filename='+file.name)
            .set('Content-Length', data.length)
            .send(data)
            .end(_ownCloudRequestCallback);
        });
      })
      .default(function(file, fileType, fileMime) {
        request
          .put(ownCloudServer + ownCloudShare + file.name)
          .ca(ownCloudCA)
          .auth(ownCloudUser, ownCloudPassword)
          .attach(file.name, file.path)
          .end(_ownCloudRequestCallback);
      });
/* jshint ignore:end */

/**
 * @name nasaraCandyBasketBackend.controllers:uploadFile
 * @description
 * 
 * A function to asynchronously handle file uploads. Currently, it
 * stores the files on the filesystem automatically and also securely
 * transfers the file to an ownCloud server share. The easiest for now
 * is to leave the files on the filesystem and ignore them possibly
 * setting up some regular cleanup routine. Eventually, the files
 * could be directly streamed from the request to the ownCloud server
 * completely by-passing the filesystem to optimize both space and
 * time.
 * 
 * Also note that this will not wait for a candy to be saved before
 * uploading the file async'ly to ownCloud which may not always be
 * desired (user changes their mind during candy updating).
 */
var uploadFile = function(req, res) {
  var fileType;
  var fileMime;
  var magic = new Magic(mmm.MAGIC_MIME_TYPE);

  magic.detectFile(req.files.file.path, function(err, result) {
    if (err) {throw err;}
    console.log('File type: ', result);
    fileMime = result;
    fileType = result.split('/')[0];
    /* jshint ignore:start */
    _sendToOwnCloud(req.files.file, fileType, fileMime);
    /* jshint ignore:end */
    res.status(200).send({'name': req.files.file.name, 
                          'originalName': req.files.file.originalname});
  });
};

/**
 * @name nasaraCandyBasketBackend.controllers:_binaryParser
 * @description
 * @private
 * 
 * A private binary parser to get files from ownCloud. Currently, only used by
 * {@link nasaraCandyBasketBackend.controllers:downloadFile}.
 */
var _binaryParser = function(res, callback) {
    res.setEncoding('binary');
    res.data = '';
    res.on('data', function (chunk) {
        res.data += chunk;
    });
    res.on('end', function () {
        callback(null, new Buffer(res.data, 'binary'));
    });
};

/**
 * @name nasaraCandyBasketBackend.controllers:downloadFile
 * @description
 * 
 * A function to asynchronously handle serving files
 * (i.e. downloads). Currently, it first downloads the files from the
 * ownCloud service, stores it on the file system before serving to
 * the frontend. Related to {@link
 * nasaraCandyBasketBackend.controllers:uploadFile}.
 * 
 * This can be further optimize by streaming file from ownCloud ->
 * ServerMemory -> Frontend. But should do for now.
 */
var downloadFile = function(req, res) {
  var fileName = req.params.id;
  var fileNameAndPath = path.join(__dirname, '/files/tmp/', fileName);

  request
    .get(ownCloudServer + ownCloudShare + fileName)
    .ca(ownCloudCA)
    .auth(ownCloudUser, ownCloudPassword)
    .parse(_binaryParser)
    .buffer()
    .end(function(ownCloudErr, ownCloudRes) {
      if (ownCloudErr) {
        console.error('Error retrieving file from ownCloud: ', ownCloudErr);
        res.status(503).send(ownCloudErr);
      } else {
        console.log('Retrieved file from ownCloud: ', ownCloudRes.status);
        fs.writeFile(fileNameAndPath, ownCloudRes.body, function (fsErr) {
          if (fsErr) {console.error('Filesystem error: ', fsErr);}
          // Send file to frontend here
          res.download(fileNameAndPath, function (err) {
            if (err) {
              console.error('Sending to frontend error: ', err);
              res.status(err.status).end();
            }
            else {
              console.log('Sent to frontent: ', fileName);
            }
          });
        });
      }
    });
};

var serve404 = function(req, res) {
  res.status(404).end();
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
exports.uploadFile = uploadFile;
exports.downloadFile = downloadFile;
exports.serve404 = serve404;

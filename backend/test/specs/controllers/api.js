'use strict';

/* jshint ignore:start */
// Since should extends Object.prototype JSHint thinks should is not used
// herein but it is. So I (well the linter) ignore this line
var should = require('should');
/* jshint ignore:end */

var request = require('supertest');
var nano = require('nano');

var conf = require('../../../config');
var controller = require('../../../app/controllers/api');

request = request(conf.url+':'+conf.port);

describe('The whole controller API', function(){
  
  before(function (next) {
    // The app needs to be started manually at the moment, I currently find
    // it easier to see logging in separate console from tests
    // This sets up only the couchdb test db
    // Create test DB to execute tests against and then use it
    controller.couchServer.db.create(controller.dbName, function(err, body) {
      if (!err) {
        console.log('Database ' + controller.dbName + ' created: ' + body);
        next();
      } else {
        console.error('Error creating ' + controller.dbName + err);
        throw err; // and stop testing
      }
    });
  });
  
  describe('GET /', function(){
    it('should respond with JSON meta data about the service', function(done){
      var expectedResponse = {'name': 'Candy Basket', 'version': 0.3};
      request
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          res.body.should.eql(expectedResponse);
          return done();
        });
    });
  });

  describe('POST /basket/candies', function(){

    it('should respond with 400 Bad Request for invalid source input', function(done){
      var candy = {'source': 'htp://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'description': 'Ghislain Hachey website personal stuff and all',
                   'tags': ['Website', 'Personal']};
      request
        .post('/basket/candies')
        .set('Content-Type', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request for missing title input', function(done){
      var candy = {'source': 'http://ghachey.info',
                   'description': 'Ghislain Hachey website personal stuff and all',
                   'tags': ['Website', 'Personal']};
      request
        .post('/basket/candies')
        .set('Content-Type', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request if missing description input', function(done){
      var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'tags': ['Website', 'Personal']};
      request
        .post('/basket/candies')
        .set('Content-Type', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request if tags not array', function(done){
      var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'tags': 'Website Personal'};
      request
        .post('/basket/candies')
        .set('Content-Type', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 when containing a attachmentFilename with no attachment', function(done){
      var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'description': 'Ghislain Hachey website personal stuff and all',
                   'tags': ['Website', 'Personal'],
                   'attachmentFilename': 'temp1.txt'
                  };
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 when containing an attachment with no attachmentFilename', function(done){
      var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'description': 'Ghislain Hachey website personal stuff and all',
                   'tags': ['Website', 'Personal'],
                   'attachment': 'YQo='
                  };
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    // it('should respond with 500 when problem connecting to CouchDB', function(done){
    //   // Valid data
    //   var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
    //                'description': 'Ghislain Hachey website personal stuff and all',
    //                'tags': ['Website', 'Personal']};
    //   // Simulate a connection problem with CouchDB by setting the reference
    //   // of couchdb to a different non-listening server
    //   request
    //     .post('/basket/candies')
    //     .set('Content-Type', 'application/json')
    //     .send(candy)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {
    //         // This test is essentially done, get back our functional couch server
    //         // instance before we move on...
    //         //controller.couchdb = controller.couchServer.db.use(controller.dbName);
    //         controller.couchdb = couchdbUp;
    //         console.log('Reset working CouchDB: ', controller.couchdb);
    //         return done(err);
    //       }
    //       return done();
    //     });
    // });

    // it('should respond with 500 when problem connecting to ownCloud', function(done){
    //   // Simulate a connection problem with ownCloud
    //   request
    //     .post('/basket/candies')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond with 201 when successfully creating candy (no attachment)', function(done){
      var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'description': 'Ghislain Hachey website personal stuff and all',
                   'tags': ['Website', 'Personal']};
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .send(candy)
        .expect(201)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 201 when successfully creating candy (with attachment)', function(done){
      var candy = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                   'description': 'Ghislain Hachey website personal stuff and all',
                   'tags': ['Website', 'Personal'],
                   'attachmentFilename': 'temp1.txt',
                   'attachment': 'YQo='
                  };
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .send(candy)
        .expect(201)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should sanitize content before creating and returning 201', function(done){
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
      //.expect('Location', /json/)
        .expect(201)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });


  describe('GET /basket/candies/:uuid', function() {
    
    it('should respond 500 when problem retrieving CouchDB', function(done){
      // Simulate a connection problem with CouchDB
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 500 when problem retrieving attachment from ownCloud', function(done){
      // Simulate a connection problem with ownCloud
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 404 if resource does not exists', function(done){
      request
        .get('/basket/candies/PUTSOMEUUIDHERE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 and the candy as JSON (no attachment)', function(done){
      
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 and the candy as JSON (with attachment)', function(done){
      
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });
    
  });

  describe('PUT /basket/candies/:uuid', function() {

    it('should respond with 400 Bad Request for invalid source input', function(done){
      // var candy = {'source': 'htp://ghachey.info', 
      //              'title': 'Ghislain Hachey Website Updated', 
      //              'description': 'Updated Ghislain Hachey website personal stuff and all',
      //              'tags': ['Website', 'Personal', 'Updated']};
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request for missing title input', function(done){
      // var candy = {'source': 'htp://ghachey.info',
      //              'description': 'Updated Ghislain Hachey website personal stuff and all',
      //              'tags': ['Website', 'Personal', 'Updated']};
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request for missing description input', function(done){
      // var candy = {'source': 'htp://ghachey.info', 
      //              'title': 'Ghislain Hachey Website Updated', 
      //              'tags': ['Website', 'Personal']};
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 500 when problem retrieving CouchDB', function(done){
      // Simulate a connection problem with CouchDB
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 500 when problem uploading attachment to ownCloud', function(done){
      // Simulate a connection problem with ownCloud
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 Candy Updated Successfully', function(done){
      
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 Candy Updated Successfully', function(done){
      
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });

  describe('DELETE /basket/candies/:uuid', function() {

    it('should respond 500 when problem retrieving CouchDB', function(done){
      // Simulate a connection problem with CouchDB
      request
        .delete('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 404 if resource to delete does not exists', function(done){
      request
        .delete('/basket/candies/PUTSOMEUUIDHERE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 if resource is deleted', function(done){
      request
        .delete('/basket/candies/PUTSOMEUUIDHERE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 404 when trying to retrieve previously deleted resource', function(done){
      request
        .get('/basket/candies/PUTSOMEUUIDHERE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });

  describe('GET /basket/candies', function() {

    it('should respond 500 when problem retrieving candies from CouchDB', function(done){
      // Simulate a connection problem with CouchDB
      request
        .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 and the list of candies by id', function(done){
      request
        .get('/basket/candies/PUTSOMEUUIDHERE')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });

  describe('GET /basket/candies/tags', function() {

    it('should respond 500 when problem retrieving tags from CouchDB', function(done){
      // Simulate a connection problem with CouchDB
      request
        .get('/basket/candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 and the list of tags with counts', function(done){
      request
        .get('/basket/candies/tags')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });

  describe('GET /basket/candies/tags-by-candies', function() {

    it('should respond 500 when problem retrieving tags by candy ids from CouchDB', function(done){
      // Simulate a connection problem with CouchDB
      request
        .get('/basket/candies/tags-by-candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 and the list of candies by id', function(done){
      request
        .get('/basket/candies/tags-by-candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });

  after(function () {
    // Destroy test DB
    // to be extra careful make sure we are destroying the test DB
    if (controller.dbName === 'candy_basket_test') {
      controller.couchServer.db.destroy(controller.dbName);
      console.log('Database ' + controller.dbName + ' destroyed');
    } else {
      throw Error('controller.dbName is an unexpected DB, did not destroy');
    }
  });

});

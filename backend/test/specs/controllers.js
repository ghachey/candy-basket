'use strict';

var async = require('async');
var request = require('supertest');
var should = require('chai').should();
var nano = require('nano');
var _ = require('underscore');

var conf = require('../../config');
var controllers = require('../../app/controllers');

request = request(conf.url+':'+conf.port);

describe('The whole controller API', function(){

  // Candy data needed across various test scopes
  var candy1, candy2, candy3, candy4, candy5;
  var candyId1, candyId2, candyId3, candyId4, candyId5;
  
  before(function (next) {
    // The app needs to be started manually at the moment, I currently find
    // it easier to see logging in separate console from tests

    // Create test DB to execute tests against
    controllers.couchServer.db.create(controllers.dbName, function(err, body) {
      if (!err) {
        console.log('Database ' + controllers.dbName + ' created: ' + body);
        // Create views in test DB
        /* jshint ignore:start */
        controllers.couchdb.insert({
          'views': {
            'candies_by_id': {
              'map': function(doc) {
                if (doc._id){
                  emit(doc._id, doc);
                }
              }
            },
            'tags_by_candy_id': {
              'map': function(doc) {
                if (doc.tags){
                  emit([doc._id,doc.date], doc.tags);
                }  
              }
            },
            'tags_with_counts': {
              'map': function(doc) {
                if(doc.tags) {
                  doc.tags.forEach(function(tag) {
                    emit(tag, 1);
                  });
                }
              },
              'reduce': function(keys, values) {
                return sum(values);
              }
            }
          }
        }, '_design/docs', function (error, response) {
          if (error) {
            throw new Error('Error creating views' + error);
          } else {
            console.log('Created views: ', response);
            next();
          }
        });
        /* jshint ignore:end */
      } else {
        console.error('Error creating ' + controllers.dbName + err);
        throw new Error('Error creating ' + controllers.dbName + err); // and stop testing
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
    //         //controllers.couchdb = controllers.couchServer.db.use(controllers.dbName);
    //         controllers.couchdb = couchdbUp;
    //         console.log('Reset working CouchDB: ', controllers.couchdb);
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
      candy1 = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                'description': 'Ghislain Hachey website personal stuff and all',
                'tags': ['Website', 'Personal']};
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .send(candy1)
        .expect('Location', /[a-f0-9]{12}/)
        .expect(201)
        .end(function(err, res){
          if (err) {return done(err);}
          candyId1 = res.header.location;
          return done();
        });
    });

    it('should respond with 201 when successfully creating candy (with attachment)', function(done){
      candy2 = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                'description': 'Ghislain Hachey website personal stuff and all',
                'tags': ['Website', 'Personal'],
                'attachmentFilename': 'temp1.txt',
                'attachment': 'YQo='
               };
      request
        .post('/basket/candies')
        .set('Accept', 'application/json')
        .send(candy2)
        .expect('Location', /[a-f0-9]{12}/)
        .expect(201)
        .end(function(err, res){
          if (err) {return done(err);}
          candyId2 = res.header.location;
          return done();
        });
    });

    it('should sanitize content before creating and returning 201', function(done){
      candy3 = {'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website', 
                'description': 'Ghislain Hachey website personal stuff and all' + 
                '<script>Hacked!</script>',
                'tags': ['Website', 'Personal'],
                'attachmentFilename': 'temp1.txt',
                'attachment': 'YQo='
               };
      request
        .post('/basket/candies')
        .set('Content-Type', 'application/json')
        .send(candy3)
        .expect('Location', /[a-f0-9]{12}/)
        .expect(201)
        .end(function(err, res){
          if (err) {return done(err);}
          candyId3 = res.header.location;
          // Retrieve this candy and check to see if description was sanitized
          request
            .get('/basket/candies/'+candyId3)
            .end(function(err, res) {
              res.body.description.should.not.equal(candy3.description);
              return done();
            });
        });
    });

  });


  describe('GET /basket/candies/:uuid', function() {
    
    // it('should respond 500 when problem retrieving CouchDB', function(done){
    //   // Simulate a connection problem with CouchDB
    //   request
    //     .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    // it('should respond 500 when problem retrieving attachment from ownCloud', function(done){
    //   // Simulate a connection problem with ownCloud
    //   request
    //     .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond 404 if resource does not exists', function(done){
      var nonExistantCandy = '8fd818a4f18e49d6abbc2dfa064bbd22';
      request
        .get('/basket/candies/'+nonExistantCandy)
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 and the candy as JSON (no attachment)', function(done){
      request
        .get('/basket/candies/'+candyId1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          res.body._id.should.equal(candyId1);
          res.body.source.should.equal(candy1.source);
          res.body.title.should.equal(candy1.title);
          new Date(Date.parse(res.body.date)).should.be.a('date');
          should.exist(res.body.description);
          res.body.tags.should.be.instanceOf(Array);
          _.zip(res.body.tags, candy1.tags).every(function(tagPair) {
            tagPair[0].should.equal(tagPair[1]);
          });
          return done();
        });
    });

    it('should respond 200 and the candy as JSON (with attachment)', function(done){
      request
        .get('/basket/candies/'+candyId2)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          res.body._id.should.equal(candyId2);
          res.body.source.should.equal(candy2.source);
          res.body.title.should.equal(candy2.title);
          new Date(Date.parse(res.body.date)).should.be.a('date');
          should.exist(res.body.description);
          res.body.attachmentFilename.should.equal(candy2.attachmentFilename);
          res.body.attachment.should.equal(candy2.attachment);
          res.body.tags.should.be.instanceOf(Array);
          _.zip(res.body.tags, candy2.tags).every(function(tagPair) {
            tagPair[0].should.equal(tagPair[1]);
          });
          return done();
        });
    });
    
  });

  describe('PUT /basket/candies/:uuid', function() {

    it('should respond with 400 Bad Request for invalid source input', function(done){
      var candy = {'source': 'htp://ghachey.info', 
                   'title': 'Ghislain Hachey Website Updated', 
                   'description': 'Updated Ghislain Hachey website personal stuff ...',
                   'tags': ['Website', 'Personal', 'Updated']};
      request
        .put('/basket/candies/'+candyId1)
        .set('Accept', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request for missing title input', function(done){
      var candy = {'source': 'htp://ghachey.info',
                   'description': 'Updated Ghislain Hachey website personal stuff ...',
                   'tags': ['Website', 'Personal', 'Updated']};
      request
        .put('/basket/candies/'+candyId1)
        .set('Accept', 'application/json')
        .send(candy)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond with 400 Bad Request for missing description input', function(done){
      var candy = {'source': 'htp://ghachey.info', 
                   'title': 'Ghislain Hachey Website Updated', 
                   'tags': ['Website', 'Personal']};
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

    it('should respond 400 Bad Request for bad UUID in data for updates', function(done){
      var candy1Updated = {
        '_id': '8fd818a4f18e49d6abbc2dfa064bbd2', // invalid UUID
        'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website Updated', 
        'description': 'Updated Ghislain Hachey website personal stuff and all',
        'tags': ['Website', 'Personal', 'Updated']
      };
      request
        .put('/basket/candies/'+candyId1)
        .set('Accept', 'application/json')
        .send(candy1Updated)
        .expect(400)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    // it('should respond 500 when problem retrieving CouchDB', function(done){
    //   // Simulate a connection problem with CouchDB
    //   request
    //     .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    // it('should respond 500 when problem uploading attachment to ownCloud', function(done){
    //   // Simulate a connection problem with ownCloud
    //   request
    //     .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond 200 Candy Updated Successfully (no attachment)', function(done){
      var candy1Updated = {
        '_id': candyId1,
        'source': 'http://ghachey.info', 'title': 'Ghislain Hachey Website Updated', 
        'description': 'Updated Ghislain Hachey website personal stuff and all',
        'tags': ['Website', 'Personal', 'Updated']
      };
      request
        .put('/basket/candies/'+candyId1)
        .set('Accept', 'application/json')
        .send(candy1Updated)
        .expect('Location', /[a-f0-9]{12}/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          // Retrieve updated candy and verify updation :)
          request
            .get('/basket/candies/'+candyId1)
            .end(function(err, res) {
              res.body._id.should.equal(candyId1);
              res.body.source.should.equal(candy1Updated.source);
              res.body.title.should.equal(candy1Updated.title);
              should.exist(res.body.description);
              res.body.tags.should.be.instanceOf(Array);
              _.zip(res.body.tags, candy1Updated.tags).every(function(tagPair) {
                tagPair[0].should.equal(tagPair[1]);
              });              
              return done();
            });
        });
    });

    it('should respond 200 Candy Updated Successfully (with attachment)', function(done){
      var candy2Updated = {
        '_id': candyId2,
        'source': 'http://ghachey.info', 'title': 'Updated Ghislain Hachey Website', 
        'description': 'Updated Ghislain Hachey website personal stuff and all',
        'tags': ['Website', 'Personal', 'Updated'],
        'attachmentFilename': 'temp3.txt',
        'attachment': 'Ygo='
      };
      request
        .put('/basket/candies/'+candyId2)
        .set('Accept', 'application/json')
        .expect('Location', /[a-f0-9]{12}/)
        .send(candy2Updated)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          // Retrieve updated candy and verify updation :)
          request
            .get('/basket/candies/'+candyId2)
            .end(function(err, res) {
              res.body._id.should.equal(candyId2);
              res.body.source.should.equal(candy2Updated.source);
              res.body.title.should.equal(candy2Updated.title);
              should.exist(res.body.description);
              res.body.attachmentFilename.should.equal(candy2Updated.attachmentFilename);
              res.body.attachment.should.equal(candy2Updated.attachment);
              res.body.tags.should.be.instanceOf(Array);
              _.zip(res.body.tags, candy2Updated.tags).every(function(tagPair) {
                tagPair[0].should.equal(tagPair[1]);
              });              
              return done();
            });
        });
    });

  });

  describe('DELETE /basket/candies/:uuid', function() {

    // it('should respond 500 when problem retrieving CouchDB', function(done){
    //   // Simulate a connection problem with CouchDB
    //   request
    //     .delete('/basket/candies/USEIDFROMCANDYCREATEABOVE')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond 404 if resource to delete does not exists', function(done){
      var nonExistantCandy = '8fd818a4f18e49d6abbc2dfa064bbd22';
      request
        .delete('/basket/candies/'+nonExistantCandy)
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 200 if resource is deleted', function(done){
      request
        .delete('/basket/candies/'+candyId1)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

    it('should respond 404 when trying to retrieve previously deleted resource', function(done){
      request
        .get('/basket/candies/'+candyId1)
        .expect(404)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
        });
    });

  });

  describe('GET /basket/candies', function() {

    // it('should respond 500 when problem retrieving candies from CouchDB', function(done){
    //   // Simulate a connection problem with CouchDB
    //   request
    //     .get('/basket/candies/USEIDFROMCANDYCREATEABOVE')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond 200 and the list of candies by id', function(done){
      /* jshint ignore:start */
      var viewResult = {
        'candiesById': 
        [ { _id: candyId2,
            source: 'http://ghachey.info',
            title: 'Updated Ghislain Hachey Website',
            description: 'Updated Ghislain Hachey website personal stuff and all',
            tags: [ 'website', 'personal', 'updated' ] },
          { _id: candyId3,
            source: 'http://ghachey.info',
            title: 'Ghislain Hachey Website',
            description: 'Ghislain Hachey website personal stuff and all',
            tags: [ 'website', 'personal' ] } 
        ]
      };
      request
        .get('/basket/candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          res.body.candiesById[0]._id.should.equal(
            viewResult.candiesById[0]._id);
          res.body.candiesById[0].source.should.equal(
            viewResult.candiesById[0].source);
          res.body.candiesById[0].description.should.equal(
            viewResult.candiesById[0].description);
          res.body.candiesById[0].title.should.equal(
            viewResult.candiesById[0].title);
          res.body.candiesById[0].description.should.equal(
            viewResult.candiesById[0].description);
          new Date(Date.parse(res.body.candiesById[0].date)).should.be.a('date');
          res.body.candiesById[0].tags.should.deep.equal(
            viewResult.candiesById[0].tags);

          res.body.candiesById[1]._id.should.equal(
            viewResult.candiesById[1]._id);
          res.body.candiesById[1].source.should.equal(
            viewResult.candiesById[1].source);
          res.body.candiesById[1].description.should.equal(
            viewResult.candiesById[1].description);
          res.body.candiesById[1].title.should.equal(
            viewResult.candiesById[1].title);
          res.body.candiesById[1].description.should.equal(
            viewResult.candiesById[1].description);
          new Date(Date.parse(res.body.candiesById[1].date)).should.be.a('date');
          res.body.candiesById[1].tags.should.deep.equal(
            viewResult.candiesById[1].tags);
          return done();
        });
      /* jshint ignore:end */
    });

  });

  describe('GET /basket/candies/tags', function() {

    // it('should respond 500 when problem retrieving tags from CouchDB', function(done){
    //   // Simulate a connection problem with CouchDB
    //   request
    //     .get('/basket/candies')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond 200 and the list of tags with counts', function(done){
      /* jshint ignore:start */
      var viewResult = {
        'tags': {
          'tags': ['Personal','Updated','Website'],
          'tags_counts': [
            {'word':'Personal','count':2},
            {'word':'Updated','count':1},
            {'word':'Website','count':2}
          ]
        }
      };
      request
        .get('/basket/candies/tags')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          return done();
          res.body.should.deep.equal(viewResult);
        });
      /* jshint ignore:end */
    });
      
  });

  describe('GET /basket/candies/tags-by-candies', function() {

    // it('should respond 500 when problem retrieving tags by candy ids from CouchDB', function(done){
    //   // Simulate a connection problem with CouchDB
    //   request
    //     .get('/basket/candies/tags-by-candies')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(500)
    //     .end(function(err, res){
    //       if (err) {return done(err);}
    //       return done();
    //     });
    // });

    it('should respond 200 and the list of candies by id', function(done){
      /* jshint ignore:start */
      var viewResult = {
        'tagsByCandies': {
          'tagsByCandies':
          [
            {
              'candy_id': candyId2,
              'tag': ['website','personal','updated']},
            {
              'candy_id': candyId3,
              'tag': ['website','personal']}
          ]
        }
      };
      request
        .get('/basket/candies/tags-by-candies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          res.body.tagsByCandies.tagsByCandies[0].candy_id.should.equal(candyId2);
          res.body.tagsByCandies.tagsByCandies[0].tag.should.deep.equal(
            viewResult.tagsByCandies.tagsByCandies[0].tag);
          res.body.tagsByCandies.tagsByCandies[1].candy_id.should.equal(candyId3);
          res.body.tagsByCandies.tagsByCandies[1].tag.should.deep.equal(
            viewResult.tagsByCandies.tagsByCandies[1].tag);
          return done();
        });
      /* jshint ignore:end */
    });

  });

  after(function () {
    // Destroy test DB
    // to be extra careful make sure we are destroying the test DB
    if (controllers.dbName === 'candy_basket_test') {
      controllers.couchServer.db.destroy(controllers.dbName);
      console.log('Database ' + controllers.dbName + ' destroyed');
    } else {
      throw Error('controllers.dbName is an unexpected DB, did not destroy');
    }
  });

});

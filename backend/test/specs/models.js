'use strict';

var should = require('chai').should();

var User = require('../../app/models').User;

describe('The whole models API', function(){
  
  before(function (next) {
    // Add some fictitious users in the database
    var user1 = new User('gcrumb', 'pass1');
    var user2 = new User('ghachey', 'pass2');
    User.addToDB(user1, function(err, user){
    });
    User.addToDB(user2, function(err, user){
    });
    next();
  });
  
  describe('Users Database', function(){
    it('should now contain candy', function(done){
      User.findByUsername('candy', function (err, user) {
        if (err) {return done(err);}
        user.username.should.eql('candy');
        return done();
      });
    });
    it('should now contain ghachey with password pass2', function(done){
      User.findByUsername('ghachey', function (err, user) {
        if (err) {return done(err);}
        user.username.should.eql('ghachey');
        user.verifyPassword('pass2', function(err, res) {
          res.should.eql(true);
          return done();
        });
      });
    });
    it('should now contain gcrumb without password pass3', function(done){
      User.findByUsername('gcrumb', function (err, user) {
        if (err) {return done(err);}
        user.username.should.eql('gcrumb');
        user.verifyPassword('pass3', function(err, res) {
          res.should.eql(false);
          return done();
        });
      });
    });
    it('should NOT contain candy2', function(done){
      User.findByUsername('candy2', function (err, user) {
        if (err) {return done(err);}
        should.not.exist(user);
        return done();
      });
    });
  });

  after(function () {
    // Don't have to destroy DB it is tied to a running instance in memory
  });

});

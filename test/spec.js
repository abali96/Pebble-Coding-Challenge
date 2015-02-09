var io = require('socket.io-client')
, assert = require('assert')
, expect = require('expect')
, should = require('should');

describe('Suite of unit tests', function() {

  var socket1;
  var numUsers = 0;
  var clients = {};

  beforeEach(function(done) {
      // Setup
      socket1 = io.connect('http://localhost:3000', {
          'reconnection delay' : 0
          , 'reopen delay' : 0
          , 'force new connection' : true
      });
      socket1.on('connect', function() {
          numUsers += 1;
          console.log('worked...');
          clients[numUsers] = socket1.id;
          done();
      });
      socket1.on('disconnect', function() {
          console.log('disconnected...');
      })
  });

  afterEach(function(done) {
      // Cleanup
      if(socket1.connected) {
          console.log('disconnecting...');
          socket1.disconnect();
      } else {
          // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
          console.log('no connection to break...');
      }
      done();
  });

  describe('First (hopefully useful) test', function() {
    it('should add clients to clients object', function(done) {
      clients['1'].should.equal(socket1.id);
      done();
    })
  });

});
var io = require('socket.io-client')
, assert = require('assert')
, expect = require('expect')
, should = require('should');

describe('Suite of unit tests', function() {

  var socket1, socket2, socket3, socket4;
  var numUsers = 0;
  var clients = {};

  beforeEach(function(done) {
      // Setup
      socket1 = io.connect('http://localhost:3000', {'reconnection delay' : 0, 'reopen delay' : 0, 'force new connection' : true});
      socket2 = io.connect('http://localhost:3000', {'reconnection delay' : 0, 'reopen delay' : 0, 'force new connection' : true});
      socket3 = io.connect('http://localhost:3000', {'reconnection delay' : 0, 'reopen delay' : 0, 'force new connection' : true});
      socket4 = io.connect('http://localhost:3000', {'reconnection delay' : 0, 'reopen delay' : 0, 'force new connection' : true});

      socket1.on('connect', function() {numUsers += 1; console.log('client 1 connected...'); clients[numUsers] = socket1.id;});
      socket2.on('connect', function() {numUsers += 1; console.log('client 2 connected...'); clients[numUsers] = socket2.id; });
      socket3.on('connect', function() {numUsers += 1; console.log('client 3 connected...'); clients[numUsers] = socket3.id;});
      socket4.on('connect', function() {numUsers += 1; console.log('client 4 connected...'); clients[numUsers] = socket4.id; done(); });

      socket1.on('disconnect', function() { console.log('client 1 disconnected...'); });
      socket2.on('disconnect', function() { console.log('client 2 disconnected...'); });
      socket3.on('disconnect', function() { console.log('client 3 disconnected...'); });
      socket4.on('disconnect', function() { console.log('client 4 disconnected...'); });
  });

  afterEach(function(done) {
      // Cleanup
      if(socket1.connected && socket2.connected && socket3.connected && socket4.connected) {
          console.log('disconnecting...');
          socket1.disconnect();
          socket2.disconnect();
          socket3.disconnect();
          socket4.disconnect();
      } else {
          // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
          console.log('no connections to break...');
      }
      done();
  });

  describe('First (hopefully useful) test', function() {
    it('should add clients to clients object', function(done) {
      clients['1'].should.equal(socket1.id);
      clients['2'].should.equal(socket2.id);
      clients['3'].should.equal(socket3.id);
      clients['4'].should.equal(socket4.id);
      done();
    })
  });

  describe('Commander functions', function() {
    it('should be able to save the order of rooms', function(done) {
      done();
    });
  });

});
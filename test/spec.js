var io = require('socket.io-client')
, assert = require('assert')
, should = require('should');

describe('Suite of unit tests', function() {
  var socket1, socket2, socket3, socket4;
  var numUsers = 0;
  var clients = {};

  beforeEach(function(done) {
    var connectionParams = {
      'reconnection delay' : 0,
      'reopen delay' : 0,
      'force new connection' : true
    }

    socket1 = io.connect('http://localhost:3000', connectionParams);
    socket2 = io.connect('http://localhost:3000', connectionParams);
    socket3 = io.connect('http://localhost:3000', connectionParams);
    socket4 = io.connect('http://localhost:3000', connectionParams);

    socket1.on('connect', function() {numUsers += 1; console.log('client 1 connected...'); clients[numUsers] = socket1.id;});
    socket2.on('connect', function() {numUsers += 1; console.log('client 2 connected...'); clients[numUsers] = socket2.id; });
    socket3.on('connect', function() {numUsers += 1; console.log('client 3 connected...'); clients[numUsers] = socket3.id;});
    socket4.on('connect', function() {numUsers += 1; console.log('client 4 connected...'); clients[numUsers] = socket4.id; done(); });
  });

  afterEach(function(done) {
    console.log('disconnecting...');
    socket1.disconnect();
    socket2.disconnect();
    socket3.disconnect();
    socket4.disconnect();
    done();
  });

  describe('The commander', function() {
    it('should have the order of his room declarations saved', function(done) {
      done();
    });

    it('should be able to save the order of rooms until only four rooms have been announced', function(done) {
      done();
    });

    it('should be able to delete the last room added to the list until four rooms have been announced', function(done) {
      done();
    });

    it('should not be able to declare "complete" until four rooms have been announced', function(done) {
      done();
    });

    it('should not be able to declare "incomplete" until four rooms have been announced', function(done) {
      done();
    });

    it('when "complete" is called, the first room announced should be paged', function(done) {
      done();
    });

    it('when "incomplete" is called, the last two room numbers should be erased', function(done) {
      done();
    });

    it('should have commands with duplicate room numbers ignored', function(done) {
      done();
    });

    it('should have commands with room numbers outside of 1 to 4 ignored', function(done) {
      done();
    });
  });

  describe('Trapped individuals', function() {
    it('should be identified/remembered by their room number on connect', function(done) {
      done();
    });

    it('should have their identity known on click', function(done) {
      done();
    });

    it('should be notified if all clicks occur in the successful order', function(done) {
      done();
    });

    it('should be notified if clicks occur in incorrect order', function(done) {
      done();
    });
  });
});
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

  describe('Trapped individuals', function() {
    it('should be identified/remembered by their room number on connect', function(done) {
      done();
    });

    it('should have their clicks tracked relative to the overall order', function(done) {
      done();
    });

    it('should be notified if a click is out of order', function(done) {
      done();
    });

    it('should be notified ("freed") if all clicks occur in the successful order', function(done) {
      done();
    });
  });

  describe('The commander', function() {
    it('should be able to save the order of rooms only until four rooms have been announced', function(done) {
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

    it('when complete is called, the first room announced should be paged', function(done) {
      done();
    });

    it('when incomplete is called, the last two room numbers should be erased', function(done) {
      done();
    });

    it('should ignore duplicate room numbers and room numbers outside of 1 to 4', function(done) {
      done();
    });

    it('should ignore duplicate room numbers and room numbers outside of 1 to 4', function(done) {
      done();
    });
  });

});
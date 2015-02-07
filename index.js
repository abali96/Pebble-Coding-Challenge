var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
var idNum = 0;

var commanderApp = require('express')();
var commanderHTTP = require('http').Server(commanderApp);
var commanderIO = require('socket.io')(commanderHTTP);
var orderArray = [];


// trapped individuals

trappedApp.get('/', function(req, res){
  res.sendFile(__dirname + '/trapped.html');
});

trappedIO.on('connection', function(socket){

  idNum += 1;
  trappedIO.emit('assign id', idNum);
  // idNum is assigned to the given client
  // on connection (simulate room numbers)

  socket.on('click', function(roomNum){
    console.log("clicked: " + roomNum);
  });
});

trappedHTTP.listen(3000, function(){
  console.log('listening on *:3000');
});


// commander

commanderIO.on('connection', function(socket) {

  socket.on('room order', function(roomNum) {
    orderArray.push(roomNum);
    console.log(orderArray);
  });

});

commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening on *:8080');
});


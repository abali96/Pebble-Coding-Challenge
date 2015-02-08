var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
var idNum = 0;
var clients = {};

var commanderApp = require('express')();
var commanderHTTP = require('http').Server(commanderApp);
var commanderIO = require('socket.io')(commanderHTTP);
var orderArray = [];

function setFree() {
  console.log("Setting Free");
  if (typeof clients[orderArray[0]] != 'undefined') {
    trappedIO.to(clients[orderArray[0]]).emit('notification');
  }
}

// trapped individuals
trappedApp.get('/', function(req, res){
  res.sendFile(__dirname + '/trapped.html');
});

trappedIO.on('connection', function(socket){
  idNum += 1;
  console.log(idNum);
  clients[idNum] = socket.id;
  socket.emit('assign id', idNum);  // used to simulate room #

  socket.on('click', function(roomNum){
    console.log("clicked: " + roomNum);
    orderArray.shift();
    if (orderArray.length > 0)
      setFree();
    else
      console.log("Free them!");
  });
});

trappedHTTP.listen(3000, function(){
  console.log('listening on *:3000');
});


// commander
commanderIO.on('connection', function(socket) {
  socket.on('room order', function(roomNum) {
    if (roomNum == "one")
      roomNum = 1;
    // validate numericality!
    orderArray.push(roomNum);
    if (orderArray.length == 3)
      setFree();
  });
});

commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening on *:8080');
});
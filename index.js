// Possible concerns:
// use something better than cookies that works between tabs
// why do you have to allow mic every request
// how to validate numericality
// disable button after click and before allowed

var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
var idNum = 0;
var clients = {};

var commanderApp = require('express')();
var commanderHTTP = require('http').Server(commanderApp);
var commanderIO = require('socket.io')(commanderHTTP);
var orderArray = [];

Number.prototype.between = function(min, max) {
  return this >= min && this <= max;
};

function setFree() {
  if (!(clients[orderArray[0]] === 'undefined')) // debatable necessity
    trappedIO.to(clients[orderArray[0]]).emit('notification');
}

// trapped individuals
trappedApp.get('/', function(req, res){
  res.sendFile(__dirname + '/trapped.html');
});

trappedIO.on('connection', function(socket){
  idNum += 1;
  console.log("Room " + idNum + " has connected");
  clients[idNum] = socket.id;
  socket.emit('assign id', idNum);  // used to simulate room #
  // clarify how rooms are identified

  socket.on('click', function(roomNum){
    console.log("Clicked: " + roomNum);
    if (roomNum != orderArray[0]) {
      trappedIO.sockets.emit('trapped forever', roomNum);
      console.log("They're trapped forever!");
    }
    else
    {
      orderArray.shift();
      if (orderArray.length > 0)
        setFree();
      else {
        console.log("Free them!");
        trappedIO.sockets.emit('free');
      }
    }
  });
});

trappedHTTP.listen(3000, function(){
  console.log('listening to rooms 1-4 on port 3000');
});

// commander
commanderIO.on('connection', function(socket) {
  console.log("Commander has connected");
  socket.on('room order', function(roomNum) {
    if (roomNum == "one")
      roomNum = 1;
    roomNum = Number(roomNum);
    if (roomNum.between(1,4)) {
      orderArray.push(roomNum);
      console.log("Current order is: " + orderArray.join(", "));
    }
    else
      console.log("Invalid input '" + roomNum + "' skipped");
    // this accounts for false input from annyang
    // (used in development so no restart is necessary
    // if annyang misinterprets a value)


    if (orderArray.length == 3)
      setFree();
  });
});

commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening to commander on port 8080');
});
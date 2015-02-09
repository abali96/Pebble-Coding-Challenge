// Possible concerns:
// how to validate numericality
// Explain how you would scale the situation out to
// multiple groups of rooms all with different orders that
// the buttons need to be pressed.
// consider 'poor internet connection'

var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
var idNum = 0;
var clients = {}; // should these be global idk

var commanderApp = require('express')();
var commanderHTTP = require('http').Server(commanderApp);
var commanderIO = require('socket.io')(commanderHTTP);
var orderArray = [];

Number.prototype.between = function(min, max) {
  return this >= min && this <= max;
};

function setFree() {
  if (!(clients[orderArray[0]] === 'undefined')) {  // debatable necessity
    trappedIO.to(clients[orderArray[0]]).emit('notification');
    console.log("Paging client " + orderArray[0]);
  }
}

function getRoomBySocketID(value) {
  for (var key in clients) {
    if (clients.hasOwnProperty(key)) {
      if (clients[key] === value)
        return key;
    }
  }
}

// trapped individuals
trappedApp.get('/', function(req, res){
  res.sendFile(__dirname + '/trapped.html');
});

trappedIO.on('connection', function(socket){
  idNum += 1;
  clients[idNum] = socket.id;

  var roomNum = getRoomBySocketID(socket.id);
  console.log("Room " + roomNum + " has connected");
  socket.emit('assign id', roomNum);  // used to simulate room #
  // clarify how rooms are identified

  socket.on('disconnect', function(){
    console.log('Room ' + roomNum + ' has disconnected');
  });

  socket.on('click', function(){
    var roomNum = getRoomBySocketID(socket.id);
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

    if (orderArray.length == 4)
      setFree();
  });
});

commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening to commander on port 8080');
});
// Explain how you would scale the situation out to
// multiple groups of rooms all with different orders that
// the buttons need to be pressed.
// consider 'poor internet connection'

var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
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
    printLog("Paging client " + orderArray[0]);
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

function printLog(value) {
  console.log(value);
  commanderIO.sockets.emit('update log', value);
}

// trapped individuals
trappedApp.get('/:roomNum', function(req, res){
  res.sendFile(__dirname + '/trapped.html');
});

trappedIO.on('connection', function(socket){
  var roomNum = socket.request.headers.referer.split('http://localhost:3000/')[1];
  clients[roomNum] = socket.id; // assume only one instance of given room's path will be accessed
  console.log("Room " + roomNum + " has connected");

  socket.on('disconnect', function(){
    console.log('Room ' + roomNum + ' has disconnected');
  });

  socket.on('click', function(){
    printLog("Clicked: " + roomNum);
    if (roomNum != orderArray[0]) {
      trappedIO.sockets.emit('trapped forever', roomNum);
      printLog("They're trapped forever!");
    }
    else
    {
      orderArray.shift();
      if (orderArray.length > 0)
        setFree();
      else {
        printLog("Free them!");
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

    if (roomNum.between(1,4) && orderArray.indexOf(roomNum) == -1) {
      orderArray.push(roomNum);
      printLog("Current order is: " + orderArray.join(", "));
    }
    else
      printLog("Repeated or invalid input '" + roomNum + "' skipped");
    // this accounts for false input from annyang or commander
    // (used in development so no restart is necessary
    // if annyang misinterprets a value)

    if (orderArray.length == 4) {
      commanderIO.sockets.emit('enable confirmation');
      commanderIO.sockets.emit('update log', "Confirm order? Say 'Complete' or 'Incomplete'");
      console.log("Asking commander to proceed with unlocking.")
    }
  });

  socket.on('confirm order', function(bool) {
    if (bool) {
      setFree();
    }
    else {
      printLog("Erasing last two terms...");
      orderArray.splice(-2, 2);
      printLog("Current order is: " + orderArray.join(", "));
    }
  });

  socket.on('erase command', function(roomNum) {
    orderArray.pop();
    printLog("Current order is: " + orderArray.join(", ")) ;
  });

});

commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening to commander on port 8080');
});
var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
var clients = {};
var orderArray = [];

Number.prototype.between = function(min, max) {
  return this >= min && this <= max;
}

function setFree() {
  if (!(clients[orderArray[0]] === 'undefined')) {  // debatable necessity
    trappedIO.to(clients[orderArray[0]]).emit('notification');
    printLog("Paging client " + orderArray[0]);
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

trappedApp.get('/', function(req, res){
    res.redirect('/1');
});

trappedIO.on('connection', function(socket){

  if (typeof socket.request.headers.referer != 'undefined')
    var roomNum = socket.request.headers.referer.split('http://localhost:3000/')[1];

  clients[roomNum] = socket.id;
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
var commanderApp = require('express')();
var commanderHTTP = require('http').Server(commanderApp);
var commanderIO = require('socket.io')(commanderHTTP);

commanderIO.on('connection', function(socket) {
  console.log('Commander has connected');
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

    if (orderArray.length == 4) {
      commanderIO.sockets.emit('enable confirmation');
      commanderIO.sockets.emit('update log', "Confirm order? Say 'Complete' or 'Incomplete'");
      console.log("Asking commander to proceed with unlocking.")
    }
  });

  socket.on('confirm order', function(bool) {
    if (bool) {
      trappedIO.sockets.emit('active buttons');
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

// routes
commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening to commander on port 8080');
});
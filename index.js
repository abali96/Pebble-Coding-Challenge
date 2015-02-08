var trappedApp = require('express')();
var trappedHTTP = require('http').Server(trappedApp);
var trappedIO = require('socket.io')(trappedHTTP);
var idNum = 0;
var clients = {};
var clicked = false;

var commanderApp = require('express')();
var commanderHTTP = require('http').Server(commanderApp);
var commanderIO = require('socket.io')(commanderHTTP);
var orderArray = [];


function waitForClick() {
  console.log(clicked);
  if (!clicked) {
    setTimeout(waitForClick, 50);
    return;
  }
}

function sendCommands() {
  console.log("In Send Commands");
  for (var i = 0; i < orderArray.length; i++) {
    clicked = false;

    if (typeof clients[orderArray[i]] != 'undefined') {
      trappedIO.to(clients[orderArray[i]]).emit('notification');
    }

    var socket = trappedIO.to(clients[orderArray[i]])
    console.log(trappedIO.to(clients[orderArray[i]]));

    waitForClick();
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
  socket.emit('assign id', idNum);
  // idNum is assigned to the given client
  // on connection (simulate room numbers)
  socket.on('click', function(roomNum){
    console.log("clicked: " + roomNum);
    clicked = true;
  });


  // receive

});

trappedHTTP.listen(3000, function(){
  console.log('listening on *:3000');
});


// commander

commanderIO.on('connection', function(socket) {
  socket.on('room order', function(roomNum) {
    orderArray.push(roomNum);
    if (orderArray.length == 2) {
      sendCommands();
    }
  });
});

commanderApp.get('/', function(req, res){
  res.sendFile(__dirname + '/commander.html');
});

commanderHTTP.listen(8080, function(){
  console.log('listening on *:8080');
});
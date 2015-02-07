var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var idNum = 0;

io.on('connection', function(socket){

  idNum += 1;
  io.emit('assign id', idNum);
  // idNum is assigned to the given client
  // on connection (simulate room numbers)

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
$('button').html("Escape Room " + window.location.pathname.slice(1) + "!");

var socket = io();

socket.on('trapped forever', function(roomNum) {
  $('#orderStatus').html("You're trapped forever! Blame room " + roomNum);
});

socket.on('free', function() {
  $('#orderStatus').html("You're free!");
});

$('button').on('click', function(){
  socket.emit('click');
  $('#orderStatus').html("Thanks!");
});

socket.on('notification', function() {
  $('#orderStatus').html('Click now.');
});

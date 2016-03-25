var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Routing
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var numUsers = 0;

io.on('connection', function(socket){
  socket.on('new message', function(data){
    io.emit('new message', data);
  });

  socket.on('add user', function(){
    numUsers++;
    io.emit('users changed', numUsers);
  });

  socket.on('disconnect', function(){
    if(numUsers>0)
      numUsers--;
    io.emit('users changed', numUsers);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


//From Docs
// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
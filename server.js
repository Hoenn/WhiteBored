
var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http)

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

http.listen(process.env.PORT||3000, function(){
  console.log('listening on *:3000');
});



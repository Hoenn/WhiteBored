var socket = io();

socket.emit('add user', '');

$('form').submit(function(){
  var msg = $('#m').val();
  if (msg.substring(0,4)=="img:") {
    msg = msg.substring(4);
    socket.emit('new message', {
    text: $('#m').val(),
    direction: randomDir(),
    img: true,
    src: msg,
    speed: randomSpeed()
  });


  }
  else {
    socket.emit('new message', {
      text: $('#m').val(),
      direction: randomDir(),
      img: false,
      speed: randomSpeed()
    });
  }
  $('#m').val('');
  return false;
  
});

//Need to replace deprecated marquee tag with JQuery solution
socket.on('new message', function(data){
  console.log(data);
  if(data.img){
    $('#messages').append($('<marquee loop="1" behavior="scroll" direction="'+data.direction+'"" scrollamount="'+data.speed+'">').append('<img src="'+data.src+'"" width="100" height="100" alt="badlink">'));
  }
  else {
    $('#messages').append($('<marquee loop="1" behavior="scroll" direction="'+data.direction+'"" scrollamount="'+data.speed+'">').text(data.text));  
  }
  
});

socket.on('users changed', function(numUsers){
  $('#userCount').text("Users: "+numUsers);
});

function randomDir(){
  return Math.random() < 0.5 ? 'left' : 'right';
}

function randomSpeed(){
  return Math.floor(Math.random()*30 + 5);
}
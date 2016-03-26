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
    ypos: randomY(),
    speed: randomSpeed()
  });


  }
  else {
    socket.emit('new message', {
      text: $('#m').val(),
      direction: randomDir(),
      img: false,
      ypos: randomY(),
      speed: randomSpeed()
    });
  }
  $('#m').val('');
  return false;
  
});

//Need to replace deprecated marquee tag with JQuery solution
socket.on('new message', function(data){
  console.log(data);
  console.log(data.ypos);
  if(data.img){
    $('body').append($('<marquee loop="1" behavior="scroll" direction="'+data.direction+'"" scrollamount="'+data.speed+'">').append('<img src="'+data.src+'"" width="100" height="100" alt="badlink">').css({
      'position': 'absolute',
      'top':Math.max(0,data.ypos-100)+'px', //temp hard code
    }));
  }
  else {
    $('body').append($('<marquee loop="1" behavior="scroll" direction="'+data.direction+'"" scrollamount="'+data.speed+'">').text(data.text).css({
      'position': 'absolute',
      'top':Math.max(0,data.ypos-16)+'px', //temp hard code
    }));  
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

function randomY(){
  console.log($(document).height())
  console.log($('#userForm').height());
  return (Math.random() * ($(document).height()-$('#userForm').height())).toFixed();
}
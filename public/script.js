var socket = io();

socket.emit('add user', '');

$('form').submit(function(){
  var msg = $('#m').val();
  if (msg.substring(0,4)=="img:") {
    msg = msg.substring(4);
    socket.emit('new message', {
    text: $('#m').val(),
    src: msg,
    ypos: randomY(),
    xpos: randomX()
  });


  }
  else {
    socket.emit('new message', {
      text: $('#m').val(),
      ypos: randomY(),
      xpos: randomX()
    });
  }
  $('#m').val('');
  return false;
  
});

socket.on('new message', function(data){
  console.log(data);
  console.log(data.xpos);
  console.log(data.ypos);
  if(data.hasOwnProperty('src')){
    $('body').append($('<div>').append('<img src="'+data.src+'"" width="100" height="100" alt="badlink">').css({
      'position': 'absolute',
      'top': Math.max(0,data.ypos-100)+'px', //temp hard code
      'left': Math.max(0,data.xpos-100)+'px'
    }).hide().fadeIn(500, function() {
      var self = this;
      setTimeout(function(){
          $(self).fadeOut(500, function(){
          $(self).remove();
        });
      }, 1000); 
    })
    ); 
  }
  else {
    $('body').append($('<div>').text(data.text).css({
      'position': 'absolute',
      'top': Math.max(0,data.ypos-16)+'px', //temp hard code
      'left': Math.max(0,data.xpos-100)+'px'
    }).hide().fadeIn(500, function() {
      var self = this;
      setTimeout(function(){
          $(self).fadeOut(500, function(){
          $(self).remove();
        });
      }, 1000); 
    })
    ); 
  }
  
});

socket.on('users changed', function(numUsers){
  $('#userCount').text("Users: "+numUsers);
});

function randomY(){
  console.log($(document).height());
  console.log($('#userForm').height());
  return (Math.random() * ($(document).height()-$('#userForm').height())).toFixed();
}

function randomX() {
  return (Math.random()*($(document).width())).toFixed();
}
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
    addNewImageMessage(data);
  }
  else {
    addNewTextMessage(data);
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

function addNewImageMessage(data) {
  var newImageMessageContainer = $('<div>');
  var newImageMessage = $('<img src="'+data.src+'"" width="100" height="100" alt="badlink">');
  //Add error handling to replace bad img
  newImageMessage.on('error', function() {
    this.onerror = null;
    this.src = 'noImage.gif';
  });
  //Add class to it to give common properties
  newImageMessage.addClass('img-msg');
  //Set position 
  newImageMessage.css({
    'top': Math.max(0, data.ypos-100)+'px',
    'left': Math.max(0, data.xpos-100)+'px'
  })
  //Hide element and set up fadeIn, wait, fadeOut
  //Add Effect: FadeIn, FadeOut, Remove Self
  addEtherealEffect(newImageMessage);
  //Add image to container
  newImageMessageContainer.append(newImageMessage);
  //Add container to body
  $('body').append(newImageMessageContainer);
}

function addNewTextMessage(data) {
  var newTextMessage = $('<div>');
  //Add text, class, custom css
  newTextMessage.text(data.text);
  newTextMessage.addClass('txt-msg');
  newTextMessage.css({
    'top': Math.max(0, data.ypos-16)+'px',
    'left': Math.max(0, data.xpos-100)+'px'
  });
  //Add Effect: FadeIn, FadeOut, Remove Self
  addEtherealEffect(newTextMessage);
  //Add message to body
  $('body').append(newTextMessage);
}

//Hides element, fadeIn -> wait -> (fadeOut -> remove)
var fadeDur = 500;
var stayDur = 1000;
function addEtherealEffect(element) {
  element.hide().fadeIn(fadeDur, function() {
    //Store scope
    var self = this;
    setTimeout(function() {
      $(self).fadeOut(fadeDur, function() {
        $(self).remove();
      })
    }, stayDur);
  });
}
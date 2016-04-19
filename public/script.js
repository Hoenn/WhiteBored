var socket = io();

socket.emit('add user', '');

mX = false;
mY = false;
//Listen to submit and generate message
$('form').submit(function(){
  
  var msg = $('#m').val();
  //If no click or no msg return
  if(!mX || !mY || (msg.length <1))
    return false;
  if (msg.substring(0,4)=="img:") {
    msg = msg.substring(4);
    socket.emit('new message', {
    text: $('#m').val(),
    src: msg,
    ypos: mY,
    xpos: mX
  });


  }
  else {
    socket.emit('new message', {
      text: $('#m').val(),
      ypos: mY,
      xpos: mX
    });
  }
  //Clear input
  $('#m').val('');
  mX = false;
  mY = false;
  $('#m').prop('disabled', true);
  //Set css to not ready
  $('#send-btn').removeClass('btn-ready');
  $('#send-btn').addClass('btn-notready');
  return false;
  
});

socket.on('new message', function(data){
  console.log(data);
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

$(document).on('click touch', function(e) {
  //Ensure we only modify when event has mouse coordinates
  if(e.pageX || e.pageY) {
    mX = (e.pageX/$(document).width()).toFixed(5);
    mY = (e.pageY/$(document).height()).toFixed(5);

    $('#send-btn').addClass('btn-ready');
    $('#m').prop('disabled', false);
    $('#m').focus();
  }
  
});

function randomY(){
  return Math.random().toFixed(5);
}

function randomX() {
  return Math.random().toFixed(5);
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
  var yActual = (data.ypos * $(document).height())- 100;
  var xActual = (data.xpos * $(document).width()) - 100; //temp hard code offsets

  newImageMessage.css({
    'top': Math.max(0, yActual)+'px',
    'left': Math.max(0, xActual)+'px'
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

  var yActual = (data.ypos * $(document).height()) - 16;
  var xActual = (data.xpos * $(document).width()) - 100; //temp hard code offsets
  //Add text, class, custom css
  newTextMessage.text(data.text);
  newTextMessage.addClass('txt-msg');
  newTextMessage.css({
    'top': Math.max(0, yActual)+'px',
    'left': Math.max(0, xActual)+'px'
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
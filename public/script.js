var socket = io();

socket.emit('add user', '');

//Immediately hide input field
$('#userForm').hide();

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
  $('#userCount').text("Users: "+numUsers)

  var duration = 500;
  //Make user count flash when it changes
  //Interrupt current animation and start new
  $('#userCount').finish().animate({
    color: '#000'
  }, duration).animate({
    color: '#f0f0f0' //default background color
  }, duration);
});

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
  else if(msg.substring(0,1)=='#' && msg.substring(7,8)==":"){
    var color = msg.substring(0,7);
    var isValidHex  = /^#[0-9A-F]{6}$/i.test(color);
    if(isValidHex) {
      socket.emit('new message', {
        text: $('#m').val().slice(8),
        color: color,
        ypos: mY,
        xpos: mX
      });
    }
    else {
      socket.emit('new message', {
        text: $('#m').val(),
        color: '#000',
        ypos: mY,
        xpos: mX
      });
    }
  }
  else {
    socket.emit('new message', {
      text: $('#m').val(),
      color: '#000',
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
  $('#userForm').hide();
  $(currentCursor).hide();
  return false;

});

//Create global cursor object for client
var currentCursor = $('<div>');
currentCursor.append('<i id="cursor" class="fa fa-comment" aria-hidden="true"></i>');
currentCursor.addClass('txt-msg');  
$('body').append(currentCursor); 
currentCursor.hide();


$(document).on('click touch', function(e) {
  //Ensure we only modify when event has mouse coordinates
  if(e.pageX || e.pageY) {
    mX = (e.pageX/$(document).width()).toFixed(5);
    mY = (e.pageY/$(document).height()).toFixed(5);

    currentCursor.css({
      'top':  e.pageY+'px',
      'left':  e.pageX+'px'
    });
    currentCursor.show();

    $('#userForm').show();
    $('#m').prop('disabled', false);
    $('#m').focus();
  }
});

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

  //Hide element and set up fadeIn, wait, fadeOut
  //Add image to container
  newImageMessageContainer.append(newImageMessage);
  //Add Effect: FadeIn, FadeOut, Remove Self
  addEtherealEffect(newImageMessageContainer);
  //Add container to body
  $('body').append(newImageMessageContainer);

  var maxHeight = $(document).height();
  var maxWidth = $(document).width();
  //Set position 
  var yActual = (data.ypos * maxHeight);
  var xActual = (data.xpos * maxWidth);
  //Clamp to screen in y direction
  var imgHeight = newImageMessage.height();
  if(yActual+ imgHeight> maxHeight) {
    yActual = maxHeight - imgHeight;
  }
  else if(yActual < 0) {
    yActual = 0;
  }
  //Clamp to screen in x direction
  var imgWidth = newImageMessage.width();
  if(xActual + imgWidth > maxWidth) {
    xActual = maxWidth - imgWidth;
  }
  else if(xActual < 0) {
    xActual = 0;
  }

  newImageMessage.css({
    'top':  yActual+'px',
    'left': xActual+'px'
  });
}

function addNewTextMessage(data) {
  var newTextMessage = $('<div>');

  //Add text, class, custom css
  newTextMessage.text(data.text);
  newTextMessage.addClass('txt-msg');

  //Add Effect: FadeIn, FadeOut, Remove Self
  addEtherealEffect(newTextMessage);

  //Add message to body
  $('body').append(newTextMessage); 

  var maxHeight = $(document).height();
  var maxWidth = $(document).width();

  //Create x and y position based on json
  var yActual = (data.ypos * maxHeight);
  var xActual = (data.xpos * maxWidth); 

  //Clamp to screen in y direction
  var txtHeight = newTextMessage.height();
  if(yActual+ txtHeight> maxHeight) {
    yActual = maxHeight - txtHeight;
  }
  else if(yActual < 0) {
    yActual = 0;
  }

  //Clamp to screen in x direction
  var txtWidth = newTextMessage.width();
  if(xActual + txtWidth > maxWidth) {
    xActual = maxWidth - txtWidth;
  }
  else if(xActual < 0) {
    xActual = 0;
  }

  newTextMessage.css({
    'top':  yActual+'px',
    'left': xActual+'px',
    'color': data.color
  });
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
var socket = io();

socket.emit('add user', '');

//Immediately hide input field
$('#userForm').hide();

socket.on('new message', function(data){
  if(data.hasOwnProperty('src')){
    addNewImageMessage(data);
  }
  else {
    addNewTextMessage(data);
  }
  
});
var userCount;
socket.on('users changed', function(numUsers){
  $('#userCount').text("Users: "+numUsers)
  userCount = numUsers;
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
  //JSON Object containing message data to send to other clients
  var msgData = {};
  if (msg.substring(0,4)=="img:") {
    msg = msg.substring(4);
    msgData['text'] = $('#m').val();
    msgData['src'] = msg;
  }
  else if(msg.substring(0,1)=='#' && msg.substring(7,8)==":"){
    var color = msg.substring(0,7);
    var isValidHex  = /^#[0-9A-F]{6}$/i.test(color);
    if(isValidHex) {  
      msgData['text'] = $('#m').val().slice(8);
      msgData['color'] = color;  
    }
    else {
      msgData['text'] = $('#m').val().slice(8);
      msgData['color'] = '#000';
    }
  }
  else {
    msgData['text'] = $('#m').val();
    msgData['color'] = '#000';
  }
  
  //Emit message to other clients
  msgData['xpos'] = mX;
  msgData['ypos'] = mY;
  socket.emit('new message', msgData);

  //Clear input
  $('#m').val('');
  mX = false;
  mY = false;
  //Set css to unready
  $('#userForm').hide();
  $(currentCursor).hide();
    $('#m').prop('disabled', true);

  return false;

});

//Create global cursor object for client then hide
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

    //Enable message box and focus
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

  //Set position and color (default black)
  newTextMessage.css({
    'top':  yActual+'px',
    'left': xActual+'px',
    'color': data.color
  });
}

//Determines duration for ethereal effects based on num users
const maximumDuration = 5000;
const minimumDuration = 1500;
const userDecay = 100;
function calculateDuration(){
  return Math.max(minimumDuration, maximumDuration - (userDecay * userCount))
}

//Hides element, fadeIn -> wait -> (fadeOut -> remove)
function addEtherealEffect(element) {
  var stayDur = calculateDuration();
  var fadeDur = stayDur * 0.05

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

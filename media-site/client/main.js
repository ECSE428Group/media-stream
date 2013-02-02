Session.set("video-contents", []);
Session.set("audio-contents",[]);
Session.set("picture-contents",[]);

Template.videogrid.contents = function () {
  return Session.get("video-contents");
}

Template.audiogrid.contents = function () {
  return Session.get("audio-contents");
}

Template.pictureviewer.contents = function(){
	return Session.get("picture-contents");
	
}
Template.pictureviewer.rendered = function(){
	// Slideshow 3
      $("#slider3").responsiveSlides({
        auto: true,
        speed: 1000,
		timeout: 2000,
        maxwidth: 800,
      });
}

Template.videogrid.events({
  'click': function (data) {
    /*$('#player-video').empty();*/
    var file = data.currentTarget.innerText;
    videoPlayerInit(file);
  }
});


Template.audiogrid.events({
  'click': function (data) {
    var selected = data.currentTarget.innerText;
    $('#player-audio').empty();
  }
});

var mediaPath = "public";

Meteor.call('getMedia', mediaPath, function (error, result) {
  if (error != undefined) {
    alert("The path returned a error");
    return;
  }
  Session.set("video-contents", result.video);
  Session.set("audio-contents",result.audio);
  Session.set("picture-contents",result.picture);
});


function videoPlayerInit(file) {
      displayMessage();
      playSelectedFile(file);
       // inputNode = document.querySelector('input');
    //  if (!URL) {
    //      displayMessage('Your browser is not ' + '<a href="http://caniuse.com/bloburls">supported</a>!', true);
    //      return;
    // }
      $('#select-modal').addClass("show");
   // inputNode.addEventListener('change', playSelectedFile, false);
      $(".video-modal .close").click(function(){
        $(this).closest(".video-modal").removeClass("show");
        $(this).next('video').get(0).pause();
    });
}

function playSelectedFile(file) {
            var videoNode = document.querySelector('video');
            //var canPlay = videoNode.canPlayType(type);
            //canPlay = (canPlay === '' ? 'no' : canPlay);
            //var message = 'Can play type "' + type + '": ' + canPlay;
            //var isError = canPlay === 'no';
            //displayMessage(message, isError);
            //if (isError) {
            //    return;
            //}
          videoNode.src = file;
          console.log(videoNode.src);
}

function displayMessage() {
            var node = document.querySelector('#message');

            return function displayMessage(message, isError) {
                node.innerHTML = message;
                node.className = isError ? 'error' : 'info';
            };
        }

function isSupported(path) {
  var supportedFiletypes = [ ".mp4" ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}



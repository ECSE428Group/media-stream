Session.set("video-contents", []);
Session.set("audio-contents",[]);

Template.videogrid.contents = function () {
  return Session.get("video-contents");
}

Template.audiogrid.contents = function () {
  return Session.get("audio-contents");
}

Template.videogrid.events({
  'click': function (data) {
    /*$('#player-video').empty();
    var file = data.currentTarget.innerText;
    videoPlayerInit(file);
  }
});


Template.audiogrid.events({
  'click': function (data) {
    var selected = data.currentTarget.innerText;
    $('#player-audio').empty();
    $('#player-audio').jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia",{
          mp3 : selected
        }).jPlayer("play");
      },
	swfPath: '../js',
 	solution: 'html, flash',
  	supplied: 'mp3',
   //	preload: 'metadata',
   height:'100px',
   width:'100px',
    volume: 0.8,
    muted: false,
    backgroundColor: '#000000',
    cssSelectorAncestor: '#player-audio',
    cssSelector: {
        videoPlay: '.jp-video-play',
    	play: '.jp-play',
        pause: '.jp-pause',
        stop: '.jp-stop',
        seekBar: '.jp-seek-bar',
        playBar: '.jp-play-bar',
        mute: '.jp-mute',
        unmute: '.jp-unmute',
        volumeBar: '.jp-volume-bar',
        volumeBarValue: '.jp-volume-bar-value',
        volumeMax: '.jp-volume-max',
        currentTime: '.jp-current-time',
        duration: '.jp-duration',
        fullScreen: '.jp-full-screen',
        restoreScreen: '.jp-restore-screen',
        repeat: '.jp-repeat',
        repeatOff: '.jp-repeat-off',
        gui: '.jp-gui',
       noSolution: '.jp-no-solution'
    },
    errorAlerts: false,
    warningAlerts: false});
  /*  jwplayer("player-audio").setup({
      file : data.currentTarget.innerText
    });*/
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



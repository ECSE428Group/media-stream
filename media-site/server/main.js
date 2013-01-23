Meteor.startup(function () {

  Meteor.methods( {
    getMedia : function (mediaPath) {
    //  var path = require('path');
//      console.log(path);
      mediaPath = "public/";
      var media = { "audio" : [] , "video" : [] };

      var require = __meteor_bootstrap__.require;
      var path = require('path');
      var fs = require('fs');
      var basepath = (path.resolve('.'));

      var contents = fs.readdirSync(path.resolve(basepath + "/" + mediaPath));

      for (var i = 0; i < contents.length; i++) {
        var file = contents[i];

        if (isMusic(file)) {
          media.audio.push(file);
        }
        else if (isVideo(file)) {
          media.video.push(file);
        }
      }
      return media;
    }
  });
});

function isVideo(path) {
  var supportedFiletypes = [ ".mp4", ".avi", ".mov", ".mkv" ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}

function isMusic(path) {
  var supportedFiletypes = [ ".mp3", ".wav", ".wma", ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}

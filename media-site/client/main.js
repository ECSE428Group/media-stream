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
    $('#player-video').empty();
    jwplayer("player-video").setup({
      file : data.currentTarget.innerText
    });
  }
});


Template.audiogrid.events({
  'click': function (data) {
    $('#player-audio').empty();
    jwplayer("player-audio").setup({
      file : data.currentTarget.innerText
    });
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

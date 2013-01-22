Session.set("contents", []);

Template.datagrid.contents = function () {
  return Session.get("contents");
}

Template.datagrid.events({
  'click': function (a, b, c) {
    $('#list-container').removeClass("span10");
    $('#list-container').addClass("span6");
    $('#player-container').removeClass("span0");
    $('#player-container').addClass("span8");

    jwplayer("player").setup({
      file : a.currentTarget.innerText
    });

    var x = 1;
  }
});

var mediaPath = "public";

Meteor.call('getMedia', mediaPath, function (error, result) {
  if (error != undefined) {
    alert("The path returned a error");
    return;
  }
  Session.set("contents", result.video.concat(result.music));
  var x = result;
});

Template.datagrid.events({
  'click row' : function(result, opts) {
    var x = result;
  }
});

Session.set("video-contents",[]);
Session.set("audio-contents",[]);
Session.set("picture-contents",[]);
Session.set("errors",[]);
Session.set("audioview360",{show:false,type:"Inline View"});
var defined = false;
Template.error.errorStatement = function () {
  return Session.get("errors");
};

Template.audiogrid.inline = function () {
  return Session.get("audioview360");
};

Template.videogrid.contents = function () {
  return Session.get("video-contents");
};

Template.audiogrid.contents = function () {
  return Session.get("audio-contents");
};


Template.picturegrid.contents = function(){
	return Session.get("picture-contents");
	
}
Template.picturegrid.rendered = function(){
	window.Code.PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), {} );
}

Template.videogrid.events({
  'click': function (data) {
    $('#player-content').empty();
    var file = data.currentTarget.innerText;
    videoPlayerInit(file);
  },
  'touchstart': function (data) {
    $('#player-content').empty();
    var file = data.currentTarget.innerText;
    videoPlayerInit(file);
  }
});

Template.audiogrid.events({
  
  'click #audioButton': function () {
    var audioview360 = Session.get("audioview360");
    if(audioview360.result == true){ 
      audioview360.result = false;
      audioview360.type = "Inline View";
      Session.set("audioview360",audioview360);
    }else{
     audioview360.result = true;
     audioview360.type = "360 View";
     Session.set("audioview360",audioview360);
    }
    
    return false;
  },
  
  'click': function (data) {
    try{
      var results = Session.get("audioview360");
      if(results.result){
       inlinePlayer.init();
      }else{
        threeSixtyPlayer.init();
      }
    }catch (err){
     var error = "Audio error :" + err;
     var results = Session.get("errors");
     results.push(error);
     Session.set("errors",results);
    }
  }
});

Template.loginPage.events({
	
	'click #loginSubmit': function(){
		alert("Testing")
	}

});


var mediaPath = "public";

Meteor.call('getMedia', mediaPath, function (error, result) {
  if (error != undefined) {
    alert("The path returned a error");
    return;
  }
  Session.set("video-contents", result.video);
  Session.set("audio-contents", result.audio);
  Session.set("picture-contents", result.picture);
});


function videoPlayerInit(file) {
  var mobile = ( navigator.userAgent.match(/(android|iPad|iPhone|iPod)/i) ? true : false );
      getSelectedFile(file);
      if (!mobile){
        if(!isHTMLSupported(file)){
          if(isDIVXSupported){
            addDivx(file);
          }
        }
        else {
            $('#select-modal').addClass("show");
            $(".video-modal .close").click(function(){
              $(this).closest(".video-modal").removeClass("show");
              $(this).next('video').get(0).pause();
            });
          }
      } else{
          $('video').get(0).load();
          $('#select-modal').addClass("show");
          $('video').get(0).play();
    }
}

function getSelectedFile(file) {
          var videoNode = document.querySelector('video');
          videoNode.src = file;
  }

function addDivx(file){
  var code = '<center> \
          <object id="ie_plugin" classid="clsid:67DABFBF-D0AB-41fa-9C46-CC0F21721616" \
            width="660" \
            height="300" \
            codebase="http://go.divx.com/plugin/DivXBrowserPlugin.cab"> \
          <param name="custommode" value="stage6" /> \
          <param name="autoPlay" value="false" /> \
          <param name="src" value="'+ file +'" /> \
          <param name="bannerEnabled" value="false" /> \
          <embed id="np_plugin" type="video/divx" \
          src="'+file+'" \
          custommode="stage6" \
          width="660" \
          height="300" \
          autoPlay="false" \
          bannerEnabled="false" \
          pluginspage="http://go.divx.com/plugin/download/"> \
          </embed> \
          </object> \
          </center>';

    var divx= document.createElement('div');
    divx.innerHTML= code;
    document.getElementById('player-content').appendChild(divx);
}

function isHTMLSupported(path) {
  var supportedFiletypes = [ ".mp4" ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}

function isDIVXSupported(path) {
  var supportedFiletypes = [ ".avi", ".mkv", ".divx" ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}

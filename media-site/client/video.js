// === Video Page File ==============================================
// This files handles video playing logic and templating.

//Variables
var useLiveStreaming = false;
var lastClick = "";
var lastDivx = false;

// Template Definition ----------------------------------------------
try{
    // Not really secure, but checks should be done at the
    // server level anyway... this just activates client
    // side buttons.
    Template.videogridOptions.superUser = function()
    {
       return (Meteor.user().username == "Admin");
    };

    Template.videogrid.contents = function ()
    {
       return Session.get("video-contents");
    };

    Template.videogridOptions.contents = function(){
        return Session.get("video-playlists");
    };

    Template.videogridOptions.userlist = function(){
            // Important: Async call!
            // Must store value in a dynamic session var.
            Meteor.call('getAllUsers', function(error, result)
            {
                    Session.set("all_users", result);
            });

            // Get the dynamic session variable here
            return Session.get("all_users");
    };

    Template.videogridOptions.alloweduser = function(){
            // Important: Async call!
            // Must store value in a dynamic session var.
            Meteor.call('getAllUsers', function(error, result)
            {
                Session.set("all_users", result);
            });

       	    // Get the dynamic session variable here
            return Session.get("all_users");
    };
   
    Template.videoMenu.contents = function(){
        return Session.get("video-playlists");
    };
    
   Template.videogrid.rendered = function(){
	// Find all tile elements
	var tileElements = document.getElementsByClassName( 'metro-tile' );
	var i;
	// Apply tile functions
	/*for ( i = 0; i < tileElements.length; i++ ) {
		Tile( tileElements[i] );
	}*/
};

Template.videopage.events(
{
    'click #buttonMenuVid .createPlaylistButton':function(event,template){
    createPlaylist(event,template,"video");
    updatePlaylists();
  },
  
  'touchstart #buttonMenuVid .createPlaylistButton':function(event,template){
    createPlaylist(event,template,"video");
    updatePlaylists();
  },
  
  'click #videogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"video");
  },
  
  'touchstart #videogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"video");
  },

  'click #videogrid .allowUser': function(event){
        var s = "Allow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.videobox').first().text();

        Meteor.call('allowUser', name, file);
  },

  'click #videogrid .disallowUser': function(event){
        var s = "Disallow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.videobox').first().text();

        Meteor.call('disallowUser', name, file);
  },

  'touchstart #videogrid .allowUser': function(event){
        var s = "Allow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.videobox').first().text();

        Meteor.call('allowUser', name, file);
  },

  'touchstart #videogrid .disallowUser': function(event){
        var s = "Disallow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.videobox').first().text();

        Meteor.call('disallowUser', name, file);
  },
  
  'click #videogrid .removeFromPlaylist':function(event,template){
    removeFromPlaylist(event,template,"video");
  },
  
  'touchstart #videogrid .removeFromPlaylist':function(event,template){
    removeFromPlaylist(event,template,"video");
  },
  
  'click #buttonMenuVid .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"video");
  },

  'touchstart #buttonMenuVid .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"video");
  },

  'click #buttonMenuVid .search.btn':function(event,template){
    search(event,template,"video");
  },
  
  'touchstart #buttonMenuVid .search.btn':function(event,template){
    search(event,template,"video");
  },
  
  'change #upload': function(ev) {
    _.each(ev.srcElement.files, function(file) {
      Meteor.saveFile(file, file.name);
    });
  },
  
  'click #transcode': function(){
    if (confirm('Are you sure you want to transcode? This may make the server hang for several minutes while all your videos are made available.')) {
      $.post('http://localhost:4040/transcode/', function(){
        alert("Finished Transcoding all your files!");
      });
    }
  }
});

Template.videogrid.events(
{
	'click .videobox': function (data)
	{
		clear_error();
		var file = data.currentTarget.innerHTML;
        if (file.indexOf("Options") >= 0 || file === ""){
            return;
        }
        if(lastClick == file){
            if(lastDivx){
              $('#divxmodal').modal('show');
              return;
            }
            else{
                $('#select-modal').addClass("show");
                $(".video-modal .videoClose").click(function(){
                        $(this).closest(".video-modal").removeClass("show");
                        $(this).next('video').get(0).pause();
                    });
                return;
            }
        }
		try{
            lastClick = file;
            while(document.querySelector('source') !== null){
                document.querySelector('source').remove();
            }
            lastDivx = false;
			var mobile = ( navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? true : false );
			videoPlayerInit(file, mobile);
		} catch (err)
		{
			show_error(get_lang("errors.video") + err);
		}
	},

	'touchstart .videobox': function (data)
	{
		clear_error();
		var file = data.currentTarget.innerHTML;
        if (file.indexOf("Options") >= 0 || file === ""){
            return;
        }
        else if(lastClick == file){
            if(lastDivx){
              $('#divxmodal').modal('show');
              return;
            }
            $('#select-modal').addClass("show");
            $(".video-modal .videoClose").click(function(){
                    $(this).closest(".video-modal").removeClass("show");
                    $(this).next('video').get(0).pause();
                });
            return;
        }
		try{
            if(lastDivx){
                removeDivx();
            }
            lastClick = file;
            lastDivx = false;
            document.querySelector('video').removeAttr('src');
			var mobile = ( navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? true : false );
			videoPlayerInit(file, mobile);
		} catch (err)
		{
			show_error(get_lang("errors.video") + err);
		}
	}
});
} catch(err){
	console.log(err);
}

function addSourceToVideo( src, type) {
    var source = document.createElement('source');
    var videoNode = document.querySelector('video');
    source.src = src;
    if(type){
        source.type = type;
    }
     videoNode.appendChild(source);
}

// Function Definition ----------------------------------------------
function videoPlayerInit(file, mobile)
{
    var vid = document.querySelector('video');
    var webM = false;
    var mp4 = false;
    Meteor.call('isFileTranscodedToWebM', file, function(error, data){
        console.log(data);
        console.log(error);
        webM = (data == 'true');
        if(data){
            var output = file.substr(0, file.lastIndexOf('.')) || file;
            var webMFile = "/transcoded/"+output +".webm";
            addSourceToVideo(webMFile, 'video/webm');
        }
    });
    Meteor.call('isFileTranscodedToMp4', file, function(error, data){
        console.log(data);
        console.log(error);
        mp4 = (data == 'true');
        if(data){
            var output = file.substr(0, file.lastIndexOf('.')) || file;
            var mp4file = "/transcoded/"+output +".mp4";
            addSourceToVideo(mp4file, 'video/mp4');
        }
        if(isHTMLSupported(file)){
        vid.src = file;
        mp4 = true;
    }
    if(vid.canPlayType('application/vnd.apple.mpegurl') == 'maybe'){
        console.log("Native browser support for HTML5 live streaming");
        useLiveStreaming = true;
    }
    console.log(mp4);
    //MOBILE//
    if(mobile){
        if(mp4 === true){
            setUpPlayer();
            return;
        }
        //if not mp4 version use live transcoding
        else if(useLiveStreaming){
            getLiveStream(file);
            setUpPlayer();
            return;
        }
        else
            return show_error(get_lang("errors.video") + "This filetype is currently not supported for mobile");
    }
    //Browser//
    else{
        //If there isn't an HTML5 compatible version, use live transcoding or divx
        if(!webM && !mp4){
             if(useLiveStreaming){
                getLiveStream(file);
                setUpPlayer();
                return;
           }
            if(isDIVXSupported(file))
            {
                addDivx(file);
            }
            else
               return show_error(get_lang("errors.video") + "This filetype is currently not supported by any available player and your browser doesn't support live streaming so we can't transcode it on the fly.");
        }
        else{
            console.log("has some sort of html5 version");
            console.log(vid.src);
            setUpPlayer();
        }
    }
    });
    

}

function setUpPlayer(file){
$('#select-modal').addClass("show");
                sxswinit();
                $('video').get(0).load();
                $('video').get(0).play();
                $(".video-modal .videoClose").click(function(){
                    $(this).closest(".video-modal").removeClass("show");
                    $(this).next('video').get(0).pause();
                });
}

function getSelectedFile(file)
{
	var videoNode = document.querySelector('video');
	videoNode.src = file;
}

function getLiveStream(file){
    var videoNode = document.querySelector('video');
    var output = file.substr(0, file.lastIndexOf('.')) || file;
    var newfile = "/transcoded/"+output +".mp4";
    videoNode.src = 'http://localhost:4040/hls/?file='+file;
}

function addDivx(file)
{
	var code = '<div id="divxmodal" class="modal hide fade in" style="width: 700px; \
    height: 400px; ">\
    <div class="modal-header">\
        <a class="close" data-dismiss="modal">×</a>\
        <h3>DivX Modal</h3>\
    </div>\
    <div class="modal-body">\
    <center> \
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
	autoPlay="true" \
	bannerEnabled="false" \
	pluginspage="http://go.divx.com/plugin/download/"> \
	</embed> \
	</object> \
	</center>\
    </div>\
    </div> ';

	var divx= document.createElement('div');
	divx.innerHTML= code;
	document.body.appendChild(divx);
    setTimeout(function(){
        $('#divxmodal').modal('show');
        $("#divxmodal").css("z-index", "1500");
    },200);
    lastDivx = true;
}

function removeDivx(){
    document.getElementById('divxmodal').remove();
}

function isHTMLSupported(path)
{
	var supportedFiletypes = [ ".mp4" ];
	for (var i = 0; i < supportedFiletypes.length; i++)
	{
		if (path.indexOf(supportedFiletypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

function isDIVXSupported(path)
{
	var supportedFiletypes = [ ".avi", ".mkv", ".divx" ];
	for (var i = 0; i < supportedFiletypes.length; i++)
	{
		if (path.indexOf(supportedFiletypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

//Borrowed and Modified courtesy of Drew Baker:
//http://stackoverflow.com/questions/4380105/html5-video-scale-modes
function sxswfullbleed(boxWidth, boxHeight, imgWidth, imgHeight) {

        // Calculate new height and width...
        var initW = imgWidth;
        var initH = imgHeight;
        var ratio = initH / initW;

        if (imgHeight > boxHeight || imgWidth > boxWidth){
            imgWidth = boxWidth/2;
            imgHeight = boxWidth/2 * ratio;
            //change size too big
        }
        if(imgHeight < boxHeight/2){
            imgHeight = boxHeight/2;
            imgWidth = imgHeight / ratio;
            //change size too small
        }
        //  Return new size for video
        return {
            width: imgWidth,
            height: imgHeight
        };
    }

    function sxswinit(){
        var browserHeight = Math.round(jQuery(window).height());
        var browserWidth = Math.round(jQuery(window).width());
        var videoHeight = jQuery('video').height();
        var videoWidth = jQuery('video').width();
        if (videoHeight > browserHeight || videoWidth > browserWidth){
            var new_size = sxsw.full_bleed(browserWidth, browserHeight, videoWidth, videoHeight);
            $('video')
            .width(new_size.width)
            .height(new_size.height);
        }
    }


jQuery(document).ready(function($) {

    /*
     * Full bleed background
     */
     var mobile = ( navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? true : false );
     if (!mobile){
        $(window).resize(function() {

            var browserHeight = Math.round($(window).height());
            var browserWidth = Math.round($(window).width());
            var videoHeight = jQuery('video').height();
            var videoWidth = jQuery('video').width();

            var new_size = sxswfullbleed(browserWidth, browserHeight, videoWidth, videoHeight);

            $('video')
            .width(new_size.width)
            .height(new_size.height);
        });
    }
     $(function() {
        $('#videodiv').click(function(){
            alert("hi");
        });
    });
});


//Borrowed from http://stackoverflow.com/questions/3505320/div-get-css-attributes-from-java-script
//Used for tests
function getStyle(el,styleProp) {
    el = document.getElementById(el);
    var result;
    if(el.currentStyle) {
        result = el.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
        result = document.defaultView.getComputedStyle(el,null)
        .getPropertyValue(styleProp);
    } else {
        result = 'unknown';
    }
    return result;
}

Meteor.saveFile = function(blob, name, path, type, callback) {
  var fileReader = new FileReader(),
    method, encoding = 'binary', type = type || 'binary';
  switch (type) {
    case 'text':
      // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
      method = 'readAsText';
      encoding = 'utf8';
      break;
    case 'binary':
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
    default:
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
  }
  fileReader.onload = function(file) {
    Meteor.call('saveFile', file.srcElement.result, name, path, encoding, callback);
  };

  fileReader[method](blob);

};

function onLoad() {
    $('#upload').click();
}


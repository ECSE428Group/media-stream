// === Video Page File ==============================================
// This files handles video playing logic and templating.

//Variables
useTranscodedStreaming = false;
useLiveStreaming = false;

// Template Definition ----------------------------------------------
try{
    Template.videogrid.contents = function ()
    {
       return Session.get("video-contents");
   };

    Template.videogridOptions.contents = function(){
        return Session.get("video-playlists");
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
  },
  
  'touchstart #buttonMenuVid .createPlaylistButton':function(event,template){
    createPlaylist(event,template,"video");
  },
  
  'click #videogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"video");
  },
  
  'touchstart #videogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"video");
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
  'click #transcode': function(){
      // console.log("clicked" + data);
      if (confirm('Are you sure you want to transcode? This may make the server hang for several minutes while all your videos are made available.')) {
          Meteor.call('transcode', function(){
          });
      }
  }
});

Template.videogrid.events(
{
	'click .metro-tile': function (data)
	{
		$('#player-content').empty();
		clear_error();
		var file = data.currentTarget.innerText;
		try{
			var mobile = ( navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? true : false );
			videoPlayerInit(file, mobile);
		} catch (err)
		{
			show_error(get_lang("errors.video") + err);
		}
	},

	'touchstart .metro-tile': function (data)
	{
		$('#player-content').empty();
		clear_error();
		var file = data.currentTarget.innerText;
		try{
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

// Function Definition ----------------------------------------------
function videoPlayerInit(file, mobile)
{
	if (!mobile)
	{
		if(!isHTMLSupported(file))
		{
			if(isDIVXSupported(file) && !useTranscodedStreaming && !useLiveStreaming)
			{
				addDivx(file);
			}
            else if(useTranscodedStreaming){
                getSelectedFileTranscodedStream(file);
                $('#select-modal').addClass("show");
                //sxswinit();
                $('video').get(0).load();
                $('video').get(0).play();
                $(".video-modal .videoClose").click(function(){
                    $(this).closest(".video-modal").removeClass("show");
                    $(this).next('video').get(0).pause();
                });
            }
            else if(useLiveStreaming){
                getLiveStream(file);
                $('#select-modal').addClass("show");
               // sxswinit();
                $('video').get(0).load();
                $('video').get(0).play();
                $(".video-modal .videoClose").click(function(){
                    $(this).closest(".video-modal").removeClass("show");
                    $(this).next('video').get(0).pause();
                });
            }
            else
                return show_error(get_lang("errors.video") + "This filetype is currently not supported by any available player.");
        }
        else
        {
         getSelectedFile(file);
         $('#select-modal').addClass("show");
         sxswinit();
         $(".video-modal .videoClose").click(function(){
            $(this).closest(".video-modal").removeClass("show");
            $(this).next('video').get(0).pause();
        });
     }
 }

 else
 {
  if(isHTMLSupported(file)){
     getSelectedFile(file);
     $('#select-modal').addClass("show");
     $('video').get(0).load();
     $('video').get(0).play();
     $(".video-modal .videoClose").click(function(){
        $(this).closest(".video-modal").removeClass("show");
        $(this).next('video').get(0).pause();
    });
 } else
 return show_error(get_lang("errors.video") + "This filetype is currently not supported for mobile");

}
}

function getSelectedFile(file)
{
	var videoNode = document.querySelector('video');
	videoNode.src = file;
}

function getSelectedFileTranscodedStream(file){
    var videoNode = document.querySelector('video');
    var output = file.substr(0, file.lastIndexOf('.')) || file;
    if ($.browser.mozilla){
        videoNode.src = "/transcoded/"+output +".webm";
    }else{
        videoNode.src = "/transcoded/"+output +".mp4";
    }
}

function getLiveStream(file){
    var videoNode = document.querySelector('video');
    var output = file.substr(0, file.lastIndexOf('.')) || file;
    //var newfile = "/transcoded/"+output +".mp4";
    Meteor.call("launchLiveTranscode", file, function(){
        console.log("Finished transcode");
            setTimeout(function(){
             videoNode.src = '/cache/stream.m3u8';
            }, 1100);
    });

   // videoNode.src = 'hls/?file='+file;
    videoNode.setAttribute("type", "video/mp4");
}

function addDivx(file)
{
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
	autoPlay="true" \
	bannerEnabled="false" \
	pluginspage="http://go.divx.com/plugin/download/"> \
	</embed> \
	</object> \
	</center>';

	var divx= document.createElement('div');
	divx.innerHTML= code;
	document.getElementById('player-content').appendChild(divx);
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


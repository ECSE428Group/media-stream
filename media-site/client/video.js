// === Video Page File ==============================================
// This files handles video playing logic and templating.

// Template Definition ----------------------------------------------
Template.videogrid.contents = function ()
{
	return Session.get("video-contents");
};

Template.videogrid.events(
{
	'click': function (data)
	{
		$('#player-content').empty();
		
		var file = data.currentTarget.innerText;
		try{
			videoPlayerInit(file);
		} catch (err)
		{
			show_error(get_lang("errors.video") + err);
		}
	},

	'touchstart': function (data)
	{
		$('#player-content').empty();
		var file = data.currentTarget.innerText;
		try{
			videoPlayerInit(file);
		} catch (err)
		{
			show_error(get_lang("errors.video") + err);
		}
	}
});


// Function Definition ----------------------------------------------
function videoPlayerInit(file)
{
	var mobile = ( navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? true : false );
	getSelectedFile(file);
	if (!mobile)
	{
		if(!isHTMLSupported(file))
		{
			if(isDIVXSupported)
			{
				addDivx(file);
			}
			else
				show_error(get_lang("errors.video") + "This filetype is currently not supported by any available player.");
		}

		else
		{
			$('#select-modal').addClass("show");
			sxsw.init();
			$(".video-modal .videoClose").click(function(){
				$(this).closest(".video-modal").removeClass("show");
				$(this).next('video').get(0).pause();
			});
		}
	}

	else
	{
		if(isHTMLSupported(file)){
            $('#select-modal').addClass("show");
            $('video').get(0).load();
            $('video').get(0).play();
            $('video').get(0).requestFullScreen();
        } else
            show_error(get_lang("errors.video") + "This filetype is currently not supported for mobile");

	}
}

function getSelectedFile(file)
{
	var videoNode = document.querySelector('video');
	videoNode.src = file;
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
var sxsw = {

    full_bleed: function(boxWidth, boxHeight, imgWidth, imgHeight) {

        // Calculate new height and width...
        var initW = imgWidth;
        var initH = imgHeight;
        var ratio = initH / initW;

        if (imgHeight > boxHeight || imgWidth > boxWidth){
            imgWidth = boxWidth/2;
            imgHeight = boxWidth/2 * ratio;
        }
        if(imgHeight < boxHeight/2){
            imgHeight = boxHeight/2;
            imgWidth = imgHeight / ratio;
        }
        //  Return new size for video
        return {
            width: imgWidth,
            height: imgHeight
        };

    },

    init: function() {
        var browserHeight = Math.round(jQuery(window).height());
        var browserWidth = Math.round(jQuery(window).width());
        var videoHeight = jQuery('video').height();
        var videoWidth = jQuery('video').width();
        if (videoHeight > browserHeight || videoWidth > browserWidth){
            var new_size = sxsw.full_bleed(browserWidth, browserHeight, videoWidth, videoHeight);
            jQuery('video')
                .width(new_size.width)
                .height(new_size.height);
        }
}
};

jQuery(document).ready(function($) {

    /*
     * Full bleed background
     */

    $(window).resize(function() {

        var browserHeight = Math.round($(window).height());
        var browserWidth = Math.round($(window).width());
        var videoHeight = jQuery('video').height();
        var videoWidth = jQuery('video').width();

        var new_size = sxsw.full_bleed(browserWidth, browserHeight, videoWidth, videoHeight);
        console.log(browserHeight);
        console.log(browserWidth);
        console.log(new_size.height);
        console.log(new_size.width);
        $('video')
            .width(new_size.width)
            .height(new_size.height);
    });

});

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
		videoPlayerInit(file);
	},

	'touchstart': function (data)
	{
		$('#player-content').empty();
		var file = data.currentTarget.innerText;
		videoPlayerInit(file);
	}
});


// Function Definition ----------------------------------------------
function videoPlayerInit(file)
{
	var mobile = ( navigator.userAgent.match(/(android|iPad|iPhone|iPod)/i) ? true : false );
	getSelectedFile(file);
	if (!mobile)
	{
		if(!isHTMLSupported(file))
		{
			if(isDIVXSupported)
			{
				addDivx(file);
			}
		}

		else
		{
			$('#select-modal').addClass("show");
			$(".video-modal .videoClose").click(function()
			{
				$(this).closest(".video-modal").removeClass("show");
				$(this).next('video').get(0).pause();
			});
		}

	}

	else
	{
		$('video').get(0).load();
		$('#select-modal').addClass("show");
		$('video').get(0).play();
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

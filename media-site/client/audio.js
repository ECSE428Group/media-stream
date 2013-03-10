// === Audio Page File ==============================================
// This file handles audio playing logic and templating.

// Template Definition ----------------------------------------------
Template.audiogrid.inline = function ()
{
	return Session.get("audioview360");
};

Template.audiogrid.contents = function ()
{
	return Session.get("audio-contents");
};

Template.audiogridOptions.contents = function(){
    return Session.get("audio-playlists");
};

Template.audioMenu.contents = function(){
    return Session.get("audio-playlists");
};

Template.audiogrid.events(
{  
	'click #audioButton': function ()
	{
		var audioview360 = Session.get("audioview360");
		if (audioview360.result == true)
		{ 
			audioview360.result = false;
			audioview360.type = "Inline View";
			Session.set("audioview360",audioview360);
		}

		else
		{
			audioview360.result = true;
			audioview360.type = "360 View";
			Session.set("audioview360",audioview360);
		}
    
		return false;
	},
  
	'click': function (data)
	{
		try
		{
			var results = Session.get("audioview360");
			if (results.result)
			{
				inlinePlayer.init();
			}

			else
			{
				threeSixtyPlayer.init();
			}
		}

		catch (err)
		{
			return false;
		}
		return true;
	}
});

Template.audiopage.events({
  'click #buttonMenuAudio .createPlaylistButton':function(event,template){
    createPlaylist(event,template,"audio");
  },
  
  'touchstart #buttonMenuAudio .createPlaylistButton':function(event,template){
    createPlaylist(event,template,"audio");
  }, 
  
  'click #audiogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"audio");
  },
  
  'touchstart  #audiogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"audio");
  },
  
  'click #buttonMenuAudio .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"audio");
  },
  
   'touchstart #buttonMenuAudio .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"audio");
  }
});
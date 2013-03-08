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
	'click .createPlaylistButtonAudio':function(){
		var name = $('.playlistNameAudio').val();
		if(name){
			Meteor.call('createPlaylist',name,function(error,result){
				if(!result)
					show_error("Successfully created."); //Need show_message
				else
					show_error("Playlist with the same name already exists.");
			});
		}else{
			show_error("You need to specify a name for the playlist.\n");
		}
	 
	}
});

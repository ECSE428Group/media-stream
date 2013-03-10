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
    'click #buttonMenuAudio .createPlaylistButton':function(){
        var name = $('#buttonMenuAudio .playlistName').val();
        if(name){
            Meteor.call('createPlaylist',name,"audio",function(error,result){
                if(!result){
                    show_success("Successfully created playlist");
                    $('#buttonMenuAudio .playlistName').val("");
                }else{
                    show_error("Playlist with the same name already exists.");
                }
            });
        }else{
            show_error("You need to specify a name for the playlist.\n");
        }
    },
      
    'click #audiogrid .addToPlaylist':function(event,template){
        var stringToRemove = "Add to ";
        var playlistName = event.target.innerHTML.substr(stringToRemove.length);
        var fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
        Meteor.call('addToPlaylist',playlistName,fileName,function(error,result){
            if(result){
                show_success("Successfully added to playlist");
            }else{
                show_error("This file already exists in the playlist.");
            }
        });
    },
    
    'click #buttonMenuAudio .viewPlaylist':function(event,template){
        var playlistName = event.target.innerHTML;
        Meteor.call('getSpecificPlaylist',playlistName,function(error,result){
            if(result){
                Session.set("audio-contents",result);
            }else{
                show_error("An error occured while retrieving the results");
            }
        });
    }
});
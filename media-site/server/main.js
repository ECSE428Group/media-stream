// === Main Server Initialization File ==============================
// This file takes care of all initialization of variables that are 
// needed by the server. It also handles Meteor's startup.

// Startup ----------------------------------------------------------

// Global Server Variables
// Setting global variables between client and server is a royal pain.
// If these need to change, edit client/main.js and client/lang.js too.
var min_username = 3;
var max_username = 15;

// Startup Function
Meteor.startup(function ()
{
	Meteor.methods(
	{
		// Load the media files into the session
		getMedia : function (mediaPath)
		{
			//var path = require('path');
			//console.log(path);

			// Check if the path was set
			if (typeof mediaPath === 'undefined')
				mediaPath = "public/";

			var media = { "audio" : [] , "video" : [], "picture" : []};

			var require = __meteor_bootstrap__.require;
			var path = require('path');
			var fs = require('fs');
			var basepath = (path.resolve('.'));

			var contents = fs.readdirSync(path.resolve(basepath + "/" + mediaPath));

			for (var i = 0; i < contents.length; i++)
			{
				var file = contents[i];

				if (isMusic(file))
				{
					media.audio.push(file);
				}

				else if (isVideo(file))
				{
					media.video.push(file);
				}

				else if (isPicture(file))
				{
					media.picture.push(file);
				}
			}

			return media;
		}
	});

	// Run Server Functions
	set_create_user_restrictions();
});


// Server Functions -------------------------------------------------

// Used to add more security to username fields.
// We don't mind about passwords here due to the way passwords
// are managed by Meteor (never sent in plaintext, we only get
// the hash, and thus don't know the length).
function set_create_user_restrictions()
{
	Accounts.validateNewUser(function (user)
	{
		return (user.username &&
			user.username.length >= min_username &&
			user.username.length <= max_username);
	});
}

// Helper Functions -------------------------------------------------
function isVideo(path)
{
	var supportedFiletypes = [ ".mp4", ".avi", ".mov", ".mkv" ];
	for (var i = 0; i < supportedFiletypes.length; i++)
	{
		if (path.indexOf(supportedFiletypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

function isMusic(path)
{
	var supportedFiletypes = [ ".mp3", ".wav", ".wma", "ogg" ];
	for (var i = 0; i < supportedFiletypes.length; i++)
	{
		if (path.indexOf(supportedFiletypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

function isPicture(path)
{
	var supportedFileTypes = [".jpg",".png",".gif",".bmp"];
	for(var i = 0; i < supportedFileTypes.length; i++)
	{
		if(path.indexOf(supportedFileTypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

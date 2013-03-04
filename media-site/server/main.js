// === Main Server Initialization File ==============================
// This file takes care of all initialization of variables that are
// needed by the server. It also handles Meteor's startup.

// Startup ----------------------------------------------------------

// Global Server Variables
// Setting global variables between client and server is a royal pain.
// If these need to change, edit client/main.js and client/lang.js too.
var min_username = 3;
var max_username = 15;

// var hlsvod = __meteor_bootstrap__.require('./hls-vod');

// Startup Function
Meteor.startup(function ()
{
	var audioCollection = new Meteor.Collection("audiofiles");
	var videoCollection = new Meteor.Collection("videofiles");
	var pictureCollection = new Meteor.Collection("picturefiles");
	var playlistCollection = new Meteor.Collection("playlist");
	console.log("Server Collections Loaded");

	load_media(audioCollection,videoCollection,pictureCollection);

	Meteor.methods(
	{
		// Send Validation Email
		send_validation_email: function (user)
		{
			Meteor.sendVerificationEmail(user._id);
		},

		// Send Reset Email
		send_reset_email: function (name)
		{
			// Find the user
			var user = Meteor.users.findOne({username: name});

			// Can't find them
			if (typeof user === 'undefined')
				return false;

			else
			{
				Accounts.sendResetPasswordEmail(user._id);
				return true;
			}
		},
		
		// Load the media files into the session
		getMedia : function (mediaPath)
		{
			
			var media = { "audio" : [] , "video" : [], "picture" : []};
			
			var audioList = audioCollection.find().fetch();
			for( var i = 0; i < audioList.length; i++ ){
				media.audio.push(audioList[i].file);
			}
			
			var videoList = videoCollection.find().fetch();
			for( var i = 0; i < videoList.length; i++ ){
				media.video.push(videoList[i].file);
			}
			
			var pictureList = pictureCollection.find().fetch();
			for( var i = 0; i < pictureList.length; i++ ){
				media.picture.push(pictureList[i].file);
			}

			
			return media;
		},
		
		//Playlist server side methods
		createPlaylist: function(playlistName){
			//If the name of the playlist already exists for this user, return false.
			//Otherwise, return create the playlist and return true.
			var userId = Meteor.userId();
			var usersPlaylist = playlistCollection.find({"id":userId}).fetch();
			
			if(usersPlaylist.length == 0){
				playlistCollection.insert({"id":userId,"playlists":[]});
			}else{
				var lists = usersPlaylist[0].playlists;
				var found = false;
				for(var i=0;i<lists.length;i++){
					if(lists[i].name == playlistName){
						found = true;
					}
				}
				if(!found){
					lists.push({"name":playlistName,"files":[]});
					playlistCollection.update({"id":userId},{"id":userId,"playlists":lists});
				}
			}
			return found;
		}
	}),
	
	// Run Server Functions
	set_create_user_restrictions();
	set_email_templates();
});


// Server Functions -------------------------------------------------

function load_media( audioCollection , videoCollection , pictureCollection)
{
	if (typeof mediaPath === 'undefined')
		mediaPath = "public/";

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
			if( audioCollection.find({"file":file}).fetch().length == 0 ){
				audioCollection.insert({"file":file});
			}

		}

		else if (isVideo(file))
		{
			if( videoCollection.find({"file":file}).fetch().length == 0 ){
				videoCollection.insert({"file":file});
			}
		}

		else if (isPicture(file))
		{
			if( pictureCollection.find({"file":file}).fetch().length == 0 ){
				pictureCollection.insert({"file":file});
			}
		}
	}
	console.log("Media Collections Updated");

}


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

// Used to populate the system email fields required by Meteor.
// Enroll account is left blank since we most likely won't be using it.
// Can't call this from the lang.js because it's server-side...
// gotta love Meteor...
function set_email_templates()
{
	// Set up the e-mail body
        Accounts.emailTemplates.siteName = "Media Site";
        Accounts.emailTemplates.from = "Media Site" + " <no-reply@meteor.com>";

	// Reset Password
        Accounts.emailTemplates.resetPassword.subject = function (user)
        {
                return "Media Site - Password Reset";
        };
        Accounts.emailTemplates.resetPassword.text = function (user, url)
        {
                return "Hey there,\n\nYou're getting this e-mail because you forgot your password over at Media-Site.\nYeah don't even try to deny it. You forgot your password. Oh the shame.\n\nIf you don't remember sending this request in though, it could mean one of two things:\n - someone is trying to hack your account and you should ignore this e-mail\n - you should buy post-it's\n\nTo reset your password, click on the link below!\n(and don't forget it this time!)\n" + url;
        };

	// Verify Email
	Accounts.emailTemplates.verifyEmail.subject = function (user)
        {
                return "Media Site - Are you human?";
        };
        Accounts.emailTemplates.verifyEmail.text = function (user, url)
        {
                return "Hey there,\n\nSo we see that you want to create a Media-Site account.\nThat's great! Really, we mean it. But first, we just want to make sure that you aren't an evil cyborg seeking world domination.\nThere are a lot roaming around lately, so we created a super complex puzzle that only humans can solve.\nYou can never be too careful, you know?\n\nTo prove that you're human and solve our puzzle, just click on the link below.\n(it isn't like an evil cyborg seeking world domination would figure THAT out anyway, right?)" + url;
        };

	// Enroll Account (not used)
        Accounts.emailTemplates.enrollAccount.subject = function (user)
        {
                return "";
        };
        Accounts.emailTemplates.enrollAccount.text = function (user, url)
        {
                return "";
        };
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

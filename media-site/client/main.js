// === Main Client Initialization File ==============================
// This file takes care of initializing stuff for use in the client.

// Session Constant Definition --------------------------------------
// Setting global variables between client and server is a royal pain.
// If these need to change, edit server/main.js and client/lang.js too.
Session.set("min_username", 3);
Session.set("max_username", 15);
Session.set("min_password", 5);
Session.set("max_password", 15);

// Session Global Variables -----------------------------------------
Session.set("errors", []);
Session.set("video-contents", []);
Session.set("audio-contents", []);
Session.set("picture-contents", []);
Session.set("document-contents",[]);
Session.set("audioview360", {show:false,type:"Inline View"});

// Local Variables --------------------------------------------------
var defined = false;
var mediaPath = "public/";

// Initialization ---------------------------------------------------
Meteor.call('getMedia', Meteor.userId(), mediaPath, function (error, result)
{
	// Handle problems
	if (error != undefined)
	{
		alert("Fatal: Can't find the media folder.\nMake sure you've created a " + mediaPath + " folder!");
		return;
	}

	// Fill the session variables with the media we found
	Session.set("video-contents", result.video);
	Session.set("audio-contents", result.audio);
	Session.set("picture-contents", result.picture);
	Session.set("document-contents",result.documents);
});

Meteor.call('getPlaylists',function(error,result){
	Session.set("video-playlists",result.video);
    Session.set("audio-playlists",result.audio);
    Session.set("picture-playlists",result.picture);
});

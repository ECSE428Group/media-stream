// === Main Client Initialization File ==============================
// This file takes care of all initialization of variables that are
// needed by the client.

// Session Variable Definition --------------------------------------
Session.set("errors",[]);
Session.set("video-contents",[]);
Session.set("audio-contents",[]);
Session.set("picture-contents",[]);
Session.set("audioview360",{show:false,type:"Inline View"});

// Global Variable Definition ---------------------------------------
var defined = false;
var mediaPath = "public/";

// Initialization ---------------------------------------------------
Meteor.call('getMedia', mediaPath, function (error, result)
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
});

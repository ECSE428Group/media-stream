// === Main Server Initialization File ==============================
// This file takes care of all initialization of variables that are
// needed by the server. It also handles Meteor's startup.

// Startup ----------------------------------------------------------

// Global Server Variables
// Setting global variables between client and server is a royal pain.
// If these need to change, edit client/main.js and client/lang.js too.
var min_username = 3;
var max_username = 15;
var silent_transcoding = true;
var media_server = { "audio" : [] , "video" : [], "picture" : []};
var fileEncoding = "";
var x = 0;

// For deployment, this must be called "static/"
var public_folder = "public/";

// Startup Function
Meteor.startup(function ()
{
    var audioCollection = new Meteor.Collection("audiofiles");
    var videoCollection = new Meteor.Collection("videofiles");
    var pictureCollection = new Meteor.Collection("picturefiles");
    var documentCollection = new Meteor.Collection("documentfiles");
    var playlistCollection = new Meteor.Collection("playlist");
    console.log("Server Collections Loaded");

    load_media(audioCollection,videoCollection,pictureCollection,documentCollection);

    Meteor.methods(
    {
        // Read File contents
        readFile: function(file)
        {
            mediaPath = public_folder;
            var require = __meteor_bootstrap__.require;
            var path = require('path');
            var fs = require('fs');
            var basepath = (path.resolve('.'));

            var contents = fs.readFileSync(path.resolve(basepath + "/" + mediaPath +file),"utf8");
            return contents;

        },
        //Update the file that was edited
        writeFile: function (file , data){
            mediaPath = public_folder;
            var require = __meteor_bootstrap__.require;
            var path = require('path');
            var fs = require('fs');
            var basepath = (path.resolve('.'));

            fs.writeFile(path.resolve(basepath + "/" + mediaPath +file),data, function (err){

                if(err){
                    console.log("Save Error");

                }else{
                    console.log("File Saved");
                }
            });
        },
        // gotten from: https://gist.github.com/dariocravero/3922137
        saveFile: function(blob, name, path, encoding) {
            var path = cleanPath(path), fs = __meteor_bootstrap__.require('fs'),
              name = cleanName(name || 'file'), encoding = encoding || 'binary',
              chroot = Meteor.chroot || public_folder;
            // Clean up the path. Remove any initial and final '/' -we prefix them-,
            // any sort of attempt to go to the parent directory '..' and any empty directories in
            // between '/////' - which may happen after removing '..'
            path = chroot + (path ? '/' + path + '/' : '/');
            // TODO Add file existance checks, etc...
            console.log("PATH", path);
		
            fs.writeFile(path + name, blob, encoding, function(err) {
              if (err) {
                throw (new Meteor.Error(500, 'Failed to save file.', err));
              } else {
                console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
              }
            });
            function cleanPath(str) {
              if (str) {
                return str.replace(/\.\./g,'').replace(/\/+/g,'').
                  replace(/^\/+/,'').replace(/\/+$/,'');
              }
            }
            function cleanName(str) {
              return str.replace(/\.\./g,'').replace(/\//g,'');
            }
          },
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

	// Finds all users by name
	// TODO: Fix function that filters the names based on the permission
	// drop-downs.
	getAllUsers : function()
	{
		return _.pluck(Meteor.users.find({}).fetch(), "username");
	},

	// Lets a user see a particular media file
	allowUser : function(username, file)
	{
		// Add to file names
            	var user = Meteor.users.findOne({"username": username});

        	// Can't find them
           	if (typeof user === 'undefined')
               		return false;

		Meteor.users.update({"username": username}, {$addToSet: {"profile.files": file} });
	},

	// Disallows a user from being able to see a particular media file
	disallowUser : function(username, file)
	{
		// Remove to file names
		var i;
		var file_list;
		var new_list = [];
            	var user = Meteor.users.findOne({"username": username});

        	// Can't find them
           	if (typeof user === 'undefined' || typeof user.profile === 'undefined' || typeof user.profile.files === 'undefined')
               		return false;

		file_list = user.profile.files;
		for (i = 0; i < file_list.length; i++)
		{
			if (file_list[i] != file)
				new_list.push(file_list[i]);
		}

		Meteor.users.update({"username": username}, {$set: {"profile.files": new_list} });
	},

        // Load the media files into the session based on what the user can see
	getMedia : function (userid, mediaPath)
        {
            // Declarations
	    var filesLen;
	    var override = false;
            var media = { "audio" : [] , "video" : [], "picture" : [], "documents" : []};
	    var user = Meteor.users.findOne({_id: userid});

	    // Does the user exist
	    if(typeof user === 'undefined')
		return false;

	    // For Admin override.
	    // We assume that the Admin is the site owner for now
	    // and has access to the server, and thus the media files
	    // and can see them through the site, as well as add
	    // users to a 'whitelist'.
	    override = (user.username == "Admin");

	    // If the user does not have a profile field
	    // don't show any files. They aren't on any whitelist.
	    if(typeof user.profile === 'undefined' || typeof user.profile.files === 'undefined')
		filesLen = 0;

	    // A whitelist is likely defined for this user.
	    // Get its length.
	    else
		filesLen = user.profile.files.length;

	    // Special case if we are the owner:
	    // we need to make sure we loop exactly once through
	    // all media files.
	    if (override)
		filesLen = 1;

            var audioList = audioCollection.find().fetch();
            for( var i = 0; i < audioList.length; i++ ){
		for( var j = 0; j < filesLen; j++ )
		{
			// Do we have access to the media
			if (override || audioList[i].file == user.profile.files[j])
                		media.audio.push(audioList[i].file);
		}
            }

            var videoList = videoCollection.find().fetch();
            for( var i = 0; i < videoList.length; i++ ){
		for( var j = 0; j < filesLen; j++ )
		{
			// Do we have access to the media
			if (override || videoList[i].file == user.profile.files[j])
				media.video.push(videoList[i].file);
		}
            }

            var pictureList = pictureCollection.find().fetch();
            for( var i = 0; i < pictureList.length; i++ ){
		for( var j = 0; j < filesLen; j++ )
		{
			// Do we have access to the media
			if (override || pictureList[i].file == user.profile.files[j])
                		media.picture.push(pictureList[i].file);
		}
            }

            var documentList = documentCollection.find().fetch();
            for( var i = 0; i < documentList.length; i++ ){
		for( var j = 0; j < filesLen; j++ )
		{
			// Do we have access to the media
			//if (override || documentList[i].file == user.profile.files[j])
                		media.documents.push(documentList[i].file);
		}
            }

            return media;
        },

        //If the name of the playlist already exists for this user, return false.
        //Otherwise, return create the playlist and return true.
        //TODO - Find more efficient way to do this
        createPlaylist: function(playlistName,playlistType){
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
              lists.push({"name":playlistName,"type":playlistType,"files":[]});
              playlistCollection.update({"id":userId},{"id":userId,"playlists":lists});
            }
          }
          return found;
        },

        //Return all the playlists for the given user organized by type.
        //TODO - Find more efficient way to do this
        getPlaylists: function(){
          var userId = Meteor.userId();
          var usersPlaylist = playlistCollection.find({"id":userId}).fetch();
          var allPlaylists = {"audio" : [] , "video" : [], "picture" : []};

          if(usersPlaylist.length == 0){
            return allPlaylists;
          }else{
            var lists = usersPlaylist[0].playlists;
            
            for(var i=0;i<lists.length;i++){
              switch(lists[i].type){
                case "video": 
                  allPlaylists.video.push(lists[i].name);
                  break;
                case "audio": 
                  allPlaylists.audio.push(lists[i].name);
                  break;
                case "picture":
                  allPlaylists.picture.push(lists[i].name);
                  break;
              }
            }
            return allPlaylists;
          }
        },
        
        //Return specific playlist.
        //TODO - Find more efficient way to do this
        getSpecificPlaylist: function(playlistName){
          var userId = Meteor.userId();
          var usersPlaylist = playlistCollection.find({"id":userId}).fetch();
          var lists = usersPlaylist[0].playlists;
              
          for(var i=0;i<lists.length;i++){
            if(lists[i].name == playlistName){
              return lists[i].files;
            }
          }
        },
        
         //Adds the given file to the given playlist.
         //TODO - Find more efficient way to do this
        addToPlaylist: function(playlistName,fileName){
          var userId = Meteor.userId();
          var usersPlaylist = playlistCollection.find({"id":userId}).fetch();
          var lists = usersPlaylist[0].playlists;
          var added = false;
          
          for(var i=0;i<lists.length;i++){
            if(lists[i].name == playlistName){
              for(var j=0;j<lists[i].files.length;j++){
                if(lists[i].files[j] == fileName){
                  return false;
                }
              }
              lists[i].files.push(fileName);
              playlistCollection.update({"id":userId},{"id":userId,"playlists":lists});
              return true;
            }
          }
        },
        
        //Removes the given file from the given playlist.
        //TODO - Find more efficient way to do this
        removeFromPlaylist: function(playlistName, fileName){
          var userId = Meteor.userId();
          var usersPlaylist = playlistCollection.find({"id":userId}).fetch();
          var lists = usersPlaylist[0].playlists;
          var added = false;
          
          for(var i=0;i<lists.length;i++){
            if(lists[i].name == playlistName){
              for(var j=0;j<lists[i].files.length;j++){
                if(lists[i].files[j] == fileName){
                  lists[i].files.splice(j,1);
                  playlistCollection.update({"id":userId},{"id":userId,"playlists":lists});
                  return true;
                }
              }
             
            }
          }
          
          return false;
        },
        
        //Returns the files matching the searchString
        //TODO - Add more detailed pattern mathcing implementation
        keywordSearch:function(searchString,type){
          var matchingItems = [];
        
          switch(type){
            case "video":
              var videoList = videoCollection.find().fetch();
              for( var i = 0; i < videoList.length; i++ ){
                if(videoList[i].file.indexOf(searchString)!== -1){
                  matchingItems.push(videoList[i].file);
                }
              }
              break;
            case "audio":
              var audioList = audioCollection.find().fetch();
              for( var i = 0; i < audioList.length; i++ ){
                  if(audioList[i].file.indexOf(searchString)!== -1){
                    matchingItems.push(audioList[i].file);
                  }
              }
              break;
            case "picture":
              var pictureList = pictureCollection.find().fetch();
              for( var i = 0; i < pictureList.length; i++ ){
                  if(pictureList[i].file.indexOf(searchString)!== -1){
                    matchingItems.push(pictureList[i].file);
                  }
              }
              break;
          }
          return matchingItems;
        },
        
        launchLiveTranscode : function(file){
            handlePlaylistRequest(file, function(){
                console.log("Finish Playlist Request");
            });
        },
		
		//sorts files alphabetically
		//TODO: 
		sortByName: function(type){
		
            var items = [];
			var sorted = [];
		
		//check whether it's picture, audio, video, or doc
			switch(type){
		
				case "picture":
					items = pictureCollection.find().fetch();
					//sorted = pictureList;
				
					//sorted = pictureCollection.find({}, {sort: {$natural:1}}).fetch();
				break;
		
				case "audio":
					items = audioCollection.find().fetch();
				break;
		
				case "video":
					items = videoCollection.find().fetch();
				break;
		
				case "document":
					items = documentCollection.find().fetch();
				break;
			}
            if(items){
                for( var i = 0; i < items.length; i++ ){   
                    sorted.push(items[i].file);
                }
                sorted.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
            }
			return sorted;
		},		
		
		//sorts files by file type
		sortByType: function(){
		
		var sorted = [];
		
		//check whether it's picture, audio, video, or doc
		switch(type){		
				case "picture":
					var pictureList = pictureCollection.find().fetch();
					
					for (var i = 0; i < pictureCollection.length(); i++){
						if (pictureList.indexOf(".jpg") != -1){
							sorted.push(pictureList[i].file);
						}
					}
					for (var i = 0; i < pictureCollection.length(); i++){
						if (pictureList.indexOf(".png") != -1){
							sorted.push(pictureList[i].file);
						}
					}
					for (var i = 0; i < pictureCollection.length(); i++){
						if (pictureList.indexOf(".gif") != -1){
							sorted.push(pictureList[i].file);
						}
					}
					for (var i = 0; i < pictureCollection.length(); i++){
						if (pictureList.indexOf(".bmp") != -1){
							sorted.push(pictureList[i].file);
						}
					}
				break;
		
				case "audio":
					var audioList = audioCollection.find().fetch();
					
					for (var i = 0; i < audioCollection.length(); i++){
						if (audioList.indexOf(".mp3") != -1){
							sorted.push(audioList[i].file);
						}
					}
					for (var i = 0; i < audioCollection.length(); i++){
						if (audioList.indexOf(".wav") != -1){
							sorted.push(audioList[i].file);
						}
					}
					for (var i = 0; i < audioCollection.length(); i++){
						if (audioList.indexOf(".wma") != -1){
							sorted.push(audioList[i].file);
						}
					}
					for (var i = 0; i < audioCollection.length(); i++){
						if (audioList.indexOf("ogg") != -1){
							sorted.push(audioList[i].file);
						}
					}
				break;
		
				case "video":
					var videoList = videoCollection.find().fetch();
					
					for (var i = 0; i < videoCollection.length(); i++){
						if (videoList.indexOf(".mp4") != -1){
							sorted.push(videoList[i].file);
						}
					}
					for (var i = 0; i < videoCollection.length(); i++){
						if (videoList.indexOf(".avi") != -1){
							sorted.push(videoList[i].file);
						}
					}
					for (var i = 0; i < videoCollection.length(); i++){
						if (videoList.indexOf(".mov") != -1){
							sorted.push(videoList[i].file);
						}
					}
					for (var i = 0; i < videoCollection.length(); i++){
						if (videoList.indexOf(".mkv") != -1){
							sorted.push(videoList[i].file);
						}
					}
				break;
		
				case "document":
					var documentList = documentCollection.find().fetch();
					
					for (var i = 0; i < documentCollection.length(); i++){
						if (documentList.indexOf(".txt") != -1){
							sorted.push(documentList[i].file);
						}
					}
					for (var i = 0; i < documentCollection.length(); i++){
						if (documentList.indexOf(".c") != -1){
							sorted.push(documentList[i].file);
						}
					}
					for (var i = 0; i < documentCollection.length(); i++){
						if (documentList.indexOf(".java") != -1){
							sorted.push(documentList[i].file);
						}
					}
					for (var i = 0; i < documentCollection.length(); i++){
						if (documentList.indexOf(".xml") != -1){
							sorted.push(documentList[i].file);
						}
					}
				break;
			}
		
			return sorted;
		
		},
		
		
        isFileTranscodedToWebM: function(file){
            var output = file.substr(0, file.lastIndexOf('.')) || file;
            var webmfile = path.join(rootPath, "/transcoded/"+output +".webm");
            return fs.existsSync(webmfile);
        },

        isFileTranscodedToMp4: function(file){
            var output = file.substr(0, file.lastIndexOf('.')) || file;
            var mp4file = path.join(rootPath, "/transcoded/"+output +".mp4");
            return fs.existsSync(mp4file);
        }

    }),

    // Run Server Functions
    set_create_user_restrictions();
    set_email_templates();
});


// Server Functions -------------------------------------------------

function load_media( audioCollection , videoCollection , pictureCollection , documentCollection)
{
    if (typeof mediaPath === 'undefined')
        mediaPath = public_folder;

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
            media_server.video.push(file);
        }

        else if (isPicture(file))
        {
            if( pictureCollection.find({"file":file}).fetch().length == 0 ){
                pictureCollection.insert({"file":file});
            }
        }

        else if (isDocument(file))
        {
            if( documentCollection.find({"file":file}).fetch().length == 0 ){
                documentCollection.insert({"file":file});
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

function isDocument(path)
{

	var supportedFileTypes = [".txt",".c",".java",".xml"];
	for(var i = 0; i < supportedFileTypes.length; i++)
	{
		if(path.indexOf(supportedFileTypes[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

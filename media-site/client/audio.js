// === Audio Page File ==============================================
// This file handles audio playing logic and templating.

// Template Definition ----------------------------------------------

// Not really secure, but checks should be done at the
// server level anyway... this just activates client
// side buttons.
Template.audiogridOptions.superUser = function()
{
   return (Meteor.user().username == "Admin");
};

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

Template.audioMenu.userList = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};

Template.audioMenu.friendList = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};

Template.audiogridOptions.userlist = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};

Template.audiogridOptions.alloweduser = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
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
    updatePlaylists();
  },
  
  'touchstart #buttonMenuAudio .createPlaylistButton':function(event,template){
    createPlaylist(event,template,"audio");
    updatePlaylists();
  }, 
  
  'click #audiogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"audio");
  },
  
  'touchstart  #audiogrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"audio");
  },

  'click #audiogrid .allowUser': function(event){
        var s = "Allow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('allowUser', name, file);
  },

  'click #audiogrid .disallowUser': function(event){
        var s = "Disallow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('disallowUser', name, file);
  },

  'click #buttonMenuAudio .friendUser': function(event){
        var s = "Friend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeFriend', name);
  },

  'click #buttonMenuAudio .unfriendUser': function(event){
        var s = "Unfriend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeUnfriend', name);
  },

  'touchstart #audiogrid .allowUser': function(event){
        var s = "Allow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('allowUser', name, file);
  },

  'touchstart #audiogrid .disallowUser': function(event){
        var s = "Disallow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('disallowUser', name, file);
  },

  'touchstart #buttonMenuAudio .friendUser': function(event){
        var s = "Friend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeFriend', name);
  },

  'touchstart #buttonMenuAudio .unfriendUser': function(event){
        var s = "Unfriend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeUnfriend', name);
  },
  
  'click #audiogrid .removeFromPlaylist':function(event,template){
    removeFromPlaylist(event,template,"audio");
  },
  
  'touchstart #audiogrid .removeFromPlaylist':function(event,template){
    removeFromPlaylist(event,template,"audio");
  },
  
  'click #buttonMenuAudio .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"audio");
  },

    'change #upload': function(ev) {
    alert("Meteor call");
    _.each(ev.srcElement.files, function(file) {
      Meteor.saveFile(file, file.name);
    });
  },
  
   'touchstart #buttonMenuAudio .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"audio");
  },
  
  'click #buttonMenuAudio .search.btn':function(event,template){
    search(event,template,"audio");
  },
  
  'touchstart #buttonMenuAudio .search.btn':function(event,template){
    search(event,template,"audio");
  },
  
  'click #buttonMenuAudio .sortByFileName':function(event, template){
    Meteor.call('sortByName',"audio",function(error,result){
        Session.set("audio-contents",result);
    });
  },
  
  'touchstart #buttonMenuAudio .sortByFileName':function(event, template){
    Meteor.call('sortByName',"audio",function(error,result){
        Session.set("audio-contents",result);
    });
  }
});

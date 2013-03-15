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
  
  'click #buttonMenuAudio .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"audio");
  },
  
   'touchstart #buttonMenuAudio .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"audio");
  }
});

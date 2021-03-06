// === Picture Page File ============================================
// This page handles the logic and templating for the picture page.

var pictureErrors = [];

// Template Definition ----------------------------------------------

// Not really secure, but checks should be done at the
// server level anyway... this just activates client
// side buttons.
Template.picturegridOptions.superUser = function()
{
   return (Meteor.user().username == "Admin");
};

Template.picturegrid.contents = function()
{
  return Session.get("picture-contents");
};

Template.pictureMenu.contents = function(){
    return Session.get("picture-playlists");
};

Template.picturegridOptions.contents = function(){
    return Session.get("picture-playlists");
};

Template.pictureMenu.userList = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};

Template.pictureMenu.friendList = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};

Template.picturegridOptions.userlist = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};

Template.picturegridOptions.alloweduser = function(){
        // Important: Async call!
        // Must store value in a dynamic session var.
        Meteor.call('getAllUsers', function(error, result)
        {
                Session.set("all_users", result);
        });

        // Get the dynamic session variable here
        return Session.get("all_users");
};
    
Template.picturegrid.encode = function(url)
{
  return encodeURIComponent(url);
};

Template.picturegrid.rendered = function()
{
  try
  {
    if ($('#picturegrid .thumbnails .imgContainer a').length)
    {
      window.Code.PhotoSwipe.attach($('#picturegrid .thumbnails .imgContainer a'), {});
      pictureErrors.photoswipe = "";
    }
  }
  catch (err)
  {
    pictureErrors.photoswipe = err;
  }
};

Template.picturepage.events({
	'click #buttonMenuPic .createPlaylistButton':function(event, template){
		createPlaylist(event,template,"picture");
    updatePlaylists();
	},
    
  'touchstart #buttonMenuPic .createPlaylistButton':function(event, template){
		createPlaylist(event,template,"picture");
    updatePlaylists();
	},
  
  'click #picturegrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"picture");
  },
  
  'click #picturegrid .removeFromPlaylist':function(event,template){
    removeFromPlaylist(event,template,"picture");
  },
  
  'touchstart #picturegrid .removeFromPlaylist':function(event,template){
    removeFromPlaylist(event,template,"picture");
  },
  
  'touchstart #picturegrid .addToPlaylist':function(event,template){
    addToPlaylist(event,template,"picture");
  },

  'click #picturegrid .allowUser': function(event){
        var s = "Allow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('allowUser', name, file);
  },

  'click #picturegrid .disallowUser': function(event){
        var s = "Disallow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('disallowUser', name, file);
  },

  'click #buttonMenuPic .friendUser': function(event){
        var s = "Friend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeFriend', name);
  },

  'click #buttonMenuPic .unfriendUser': function(event){
        var s = "Unfriend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeUnfriend', name);
  },

  'touchstart #picturegrid .allowUser': function(event){
        var s = "Allow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('allowUser', name, file);
  },

  'touchstart #picturegrid .disallowUser': function(event){
        var s = "Disallow ";
        var name = event.target.innerHTML.substr(s.length);
        var file = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');

        Meteor.call('disallowUser', name, file);
  },
  
  'touchstart #buttonMenuPic .friendUser': function(event){
        var s = "Friend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeFriend', name);
  },

  'touchstart #buttonMenuPic .unfriendUser': function(event){
        var s = "Unfriend ";
        var name = event.target.innerHTML.substr(s.length);

        Meteor.call('makeUnfriend', name);
  },

  'click #buttonMenuPic .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"picture");   
  },
  
  'touchstart #buttonMenuPic .viewPlaylist':function(event,template){
    viewPlaylist(event,template,"picture");   
  },
  
  'click #buttonMenuPic .search.btn':function(event,template){
    search(event,template,"picture");
  },
  
  'touchstart #buttonMenuPic .search.btn':function(event,template){
    search(event,template,"picture");
  },

  'click #buttonMenuPic .sortByNameButton':function(event, template){
    sortByName(event,template,"picture");
  },
	
  'click #buttonMenuPic .sortByTypeButton':function(event, template){
    sortByType(event,template,"picture");
  },
  
  'click #buttonMenuPic .sortByFileName':function(event, template){
    Meteor.call('sortByName',"picture",function(error,result){
        Session.set("picture-contents",result);
    });
  },
  
  'touchstart #buttonMenuPic .sortByFileName':function(event, template){
    Meteor.call('sortByName',"picture",function(error,result){
        Session.set("picture-contents",result);
    });
  }
});

//Error handling
function displayPictureErrors()
{
  if ($('#tab-picture .active'))
  {
    var message = "";
    for (var key in pictureErrors)
    {
      message = pictureErrors[key];
      if (message)
      {
        show_error(get_lang("errors.picture")+"\n"+pictureErrors[key]);
      }
    }
  }
}


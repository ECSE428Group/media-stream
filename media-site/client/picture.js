// === Picture Page File ============================================
// This page handles the logic and templating for the picture page.

var pictureErrors = [];

// Template Definition ----------------------------------------------
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
	},
    
  'touchstart #buttonMenuPic .createPlaylistButton':function(event, template){
		createPlaylist(event,template,"picture");
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


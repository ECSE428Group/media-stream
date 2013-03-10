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
      window.Code.PhotoSwipe.attach($('.thumbnails .imgContainer a'), {});
      pictureErrors.photoswipe = "";
    }
  }
  catch (err)
  {
    pictureErrors.photoswipe = err;
  }
};

Template.picturepage.events({
	'click #buttonMenuPic .createPlaylistButton':function(){
		var name = $('#buttonMenuPic .playlistName').val();
		if(name){
			Meteor.call('createPlaylist',name,"picture",function(error,result){
				if(!result){
                    show_success("Successfully created playlist");
                    $('#buttonMenuPic .playlistName').val("");
				}else{
					show_error("Playlist with the same name already exists.");
                }
			});
		}else{
			show_error("You need to specify a name for the playlist.\n");
		}
	},
    
    'click #picturegrid .addToPlaylist':function(event,template){
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
    
    'click #buttonMenuPic .viewPlaylist':function(event,template){
        var playlistName = event.target.innerHTML;
        Meteor.call('getSpecificPlaylist',playlistName,function(error,result){
            if(result){
                Session.set("picture-contents",result);
            }else{
                show_error("An error occured while retrieving the results");
            }
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
// === Picture Page File ============================================
// This page handles the logic and templating for the picture page.

var pictureErrors = [];

// Template Definition ----------------------------------------------
Template.picturegrid.contents = function()
{
  return Session.get("picture-contents");
};

Template.picturegrid.encode = function(url)
{
  return encodeURIComponent(url);
};

Template.picturegrid.rendered = function()
{
  try
  {
    if ($('.thumbnails .imgContainer a').length)
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
	'click .createPlaylistButtonImg':function(){
		var name = $('.playlistNameImg').val();
		if(name){
			Meteor.call('createPlaylist',name,function(error,result){
				if(result)
					alert("Successfully created.");
				else
					alert("Playlist exists.");
			});
		}else{
			show_error("You need to specify a name for the playlist.\n");
		}
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
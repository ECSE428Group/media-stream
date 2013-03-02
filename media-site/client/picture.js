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
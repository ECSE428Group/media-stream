// === Picture Page File ============================================
// This page handles the logic and templating for the picture page.

var pictureErrors = [];

// Template Definition ----------------------------------------------
Template.picturegrid.contents = function()
{
	return Session.get("picture-contents");
};

Template.picturegrid.rendered = function()
{
	try{
		window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {});
		pictureErrors.photoswipe = "";
	}catch(err){
		pictureErrors.photoswipe = err;
	}
};

//Error handling
function displayPictureErrors(){
	if($('#tab-picture .active')){
		var message = "";
		for(var key in pictureErrors){
			message = pictureErrors[key];
			if(message){
				show_error(get_lang("errors.picture")+"\n"+pictureErrors[key]);
			}
		}
	}
};


// === Picture Page File ============================================
// This page handles the logic and templating for the picture page.

var picture_errors = [];

// Template Definition ----------------------------------------------
Template.picturegrid.contents = function()
{
	return Session.get("picture-contents");
};

Template.picturegrid.rendered = function()
{
	try{
		window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {});
		picture_errors.photoswipe = "";
	}catch(err){
		picture_errors.photoswipe = err;
	}
};

function displayPictureErrors(){
	if($('#tab-picture .active')){
		var message = "";
		for(var key in picture_errors){
			message = picture_errors[key];
			if(message){
				show_error(get_lang("errors.picture")+"\n"+picture_errors[key]);
			}
		}
	}
};

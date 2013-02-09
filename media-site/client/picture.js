// === Picture Page File ============================================
// This page handles the logic and templating for the picture page.

// Template Definition ----------------------------------------------
Template.picturegrid.contents = function()
{
	return Session.get("picture-contents");
};

Template.picturegrid.rendered = function()
{
	window.Code.PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), {});
};

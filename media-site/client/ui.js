// === UI Template File =============================================
// This file handles common UI operations like the navigation
// and error handling templates.
try{
// Template Definition ----------------------------------------------
Template.navigation.rendered = function ()
{
	// Remove tabs unless logged in.
	if(Meteor.user())
		process_login_more();

	else
		process_logout();
};

Template.navigation.events(
{
	// Clear any error message
	'click': function()
	{
		clear_error();
	},

	// Hook the logout button
	'click #tab-logout': function()
	{
		process_logout();
	},
	
	//For displaying picture specific errors
	'click #tab-picture':function()
	{
		displayPictureErrors();
	}
});

Template.error.errorStatement = function ()
{
	// Get the current error message
	return Session.get("errors");
};
} catch(err){
	console.log(err);
}

// Function Definition ----------------------------------------------

// Use this function to display an error message to the user.
// Errors are cleared every time. To send multiple errors, concatenate them.
// Also, use the get_lang function to get global error messages.
function show_error(err_string)
{
	var errors = [];
	errors.push(err_string);
	try{
	Session.set("errors", errors);
	}catch(err){
		console.log(err);
	}
	$('.alert').show();

	return errors;
}

// Clears the error message
function clear_error()
{
	$('.alert .close').live("click", function()
	{
		$(this).parent().hide();
	});

	Session.set("errors", []);
}

Template.buttonOptions.contents = function(){
	return Session.get("playlist-contents");
};
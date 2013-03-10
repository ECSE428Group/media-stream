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
    clear_success();
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

Template.error.events({
  'click .alert-error .close':function(event, template){
    var errorMessage = $(event.target).siblings('.message').text();
    removeSpecificError(errorMessage);
  }
});

Template.success.events({
  'click .alert-success .close':function(event, template){
    var successMessage = $(event.target).siblings('.message').text();
    removeSpecificSuccessMessage(successMessage);
  }
});

Template.error.errorStatement = function ()
{
	// Get the current error message
	return Session.get("errors");
};

Template.success.successStatement = function()
{
  //Get the current success message
  return Session.get("successMessages");
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

function show_success(successMessage_string)
{
	var successMessages = [];
	successMessages.push(successMessage_string);
	try{
	Session.set("successMessages", successMessages);
	}catch(err){
		console.log(err);
	}
	$('.alert').show();

	return successMessages;
}

// Clears the error message
function clear_success()
{
	$('.alert .close').live("click", function()
	{
		$(this).parent().hide();
	});

	Session.set("successMessages", []);
}

function removeSpecificError(error)
{
  var errors = Session.get("errors");
  var index = errors.indexOf(error);
  errors.splice(index,1);
  Session.set("errors",errors);
}

function removeSpecificSuccessMessage(successMessage)
{
  var successMessages = Session.get("successMessages");
  var index = successMessages.indexOf(successMessages);
  successMessages.splice(index,1);
  Session.set("successMessages",successMessages);
}
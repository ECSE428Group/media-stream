// === Login logic file =============================================
// All logon procedures and template events are stored here.

// Template Definition ----------------------------------------------
Template.loginpage.events({

	// LOGIN ====================================================
	'click #login-submit': function()
	{
		prepare_login();
	},

	'keypress #login-user': function(key)
	{
		// Enter Key
		if(key.which === 13)
			prepare_login();
	},

	'keypress #login-pass': function(key)
	{
		// Enter Key
		if(key.which === 13)
			prepare_login();
	},

	// REGISTRATION ============================================
	'click #reg-submit': function()
	{
		prepare_register();
	},

	'keypress #reg-user': function(key)
	{
		// Enter Key
		if(key.which === 13)
			prepare_register();
	},

	'keypress #reg-pass': function(key)
	{
		// Enter Key
		if(key.which === 13)
			prepare_register();
	},

	'keypress #reg-confirm': function(key)
	{
		// Enter Key
		if(key.which === 13)
			prepare_register();
	}
});


// Function Definition ----------------------------------------------

// Called to validate the login fields and such.
function prepare_login()
{
	// Grab Values
	var user_id = $('#login-user').val();
	var pass = $('#login-pass').val();

	// Are all fields filled
	if (user_id == "" || pass == "")
	{
		show_error(get_lang("errors.fill_fields"));
		return;
	}

	// Log-in
	process_login(user_id, pass);

	// Clear the user and pass fields
	$('#login-user').val("");
	$('#login-pass').val("");
}

// Called to validate the registration form.
function prepare_register()
{
	// Grab Values
	var user_id = $('#reg-user').val();
	var pass = $('#reg-pass').val();
	var confirm = $('#reg-confirm').val();
	var settings = Session.get("config");

	// Are all fields filled
	if (user_id == "" || pass == "" || confirm == "")
	{
		show_error(get_lang("errors.fill_fields"));
		return;
	}

	// Length checks
	if (user_id.length < Session.get("min_username"))
	{
		show_error(get_lang("errors.name_short"));
		return;
	}

	if (user_id.length > Session.get("max_username"))
	{
		show_error(get_lang("errors.name_long"));
		return;
	}

	if (pass.length < Session.get("min_password"))
	{
		show_error(get_lang("errors.pass_short"));
		return;
	}

	if (pass.length > Session.get("max_password"))
	{
		show_error(get_lang("errors.pass_long"));
		return;
	}

	// Check if passwords are the same
	if (pass != confirm)
	{
		show_error(get_lang("errors.pass_mismatch"));
		return;
	}

	// Finally, try to add the user
	process_login(user_id, pass, true);

	// Clear the user and pass fields
	$('#reg-user').val("");
	$('#reg-pass').val("");
	$('#reg-confirm').val("");
}

// Process a login request.
// This also handles new registration requests via the new_user optional parameter.
function process_login(user_id, pass, new_user)
{
	// Logging in normally
	if (typeof(new_user) === 'undefined' || !new_user)
	{
		Meteor.loginWithPassword(user_id, pass, function(error)
		{
			if (error)
				show_error(get_lang("errors.bad_login"));

			else
				process_login_more();
		});
	}

	// Creating an account
	else
	{
		Accounts.createUser({username: user_id, password: pass});
		Meteor.loginWithPassword(user_id, pass, function(error)
		{
			if (error)
				show_error(get_lang("errors.user_exists"));

			else
				process_login_more();
		});
	}
}

// Used because of the callback function.
// This is called after a successful login.
function process_login_more()
{
	// Update Tabs
	$('#tab-audio').show();
	$('#tab-video').show();
	$('#tab-picture').show();
	$('#tab-logout').show();
	$('#tab-login').hide();

	// Clear any error message
	clear_error();

	// Load the Home Tab
	$('#tab-home a').tab('show');
}

// This handles both a logout and the ensuing ui changes.
function process_logout()
{
	// Tell Meteor
	Meteor.logout();

	// Update Tabs
	$('#tab-audio').hide();
	$('#tab-video').hide();
	$('#tab-picture').hide();
	$('#tab-logout').hide();
	$('#tab-login').show();

	// Clear any error message
	clear_error();

	// Load the Home Tab
	// This one might be overriden by the template href call
	// since we logout by clicking a link
	$('#tab-home a').tab('show');
}

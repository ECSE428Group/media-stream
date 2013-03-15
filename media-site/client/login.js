// === Login logic file =============================================
// All logon procedures and template events are stored here.

// Template Definition ----------------------------------------------
Template.profile-page.events(
{
	'click #saveChanges': function()
	{
		var old_pass = $('#profile-password').val();
		var new_pass = $('#profile-newpassword').val();
		var cnf_pass = $('#profile-confirmpass').val();

		if (new_pass != cnf_pass)
			show_error("Bad confirmation.");

		if (old_pass == "" || new_pass == "" || cnf_pass == "")
			show_error("No empty fields.");

		Accounts.changePassword(old_pass, new_pass);
	},
};

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

	'keypress #reg-email': function(key)
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
	},

	// FORGOT PASSWORD =========================================
	'click #login-forgot': function()
	{
		send_forgot_pass_email();
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
		return false;
	}
	// Log-in
	//TEST
	if(!thisIsTesting){
  	process_login(user_id, pass);
  }
	// Clear the user and pass fields
	$('#login-user').val("");
	$('#login-pass').val("");
  
  //Credentials are valid
  return true;
}

// Called to validate the registration form.
function prepare_register()
{
	// Grab Values
	var user_id = $('#reg-user').val();
	var email = $('#reg-email').val();
	var pass = $('#reg-pass').val();
	var confirm = $('#reg-confirm').val();

	// Are all fields filled
	if (user_id == "" || pass == "" || confirm == "" || email == "")
	{
		show_error(get_lang("errors.fill_fields"));
		return false;
	}

	// Length checks
	if (user_id.length < Session.get("min_username"))
	{
		show_error(get_lang("errors.name_short"));
		return false;
	}

	if (user_id.length > Session.get("max_username"))
	{
		show_error(get_lang("errors.name_long"));
		return false;
	}

	if (pass.length < Session.get("min_password"))
	{
		show_error(get_lang("errors.pass_short"));
		return false;
	}

	if (pass.length > Session.get("max_password"))
	{
		show_error(get_lang("errors.pass_long"));
		return false;
	}

	// Check if passwords are the same
	if (pass != confirm)
	{
		show_error(get_lang("errors.pass_mismatch"));
		return false;
	}

	// Finally, try to add the user
	//TEST
	if(!thisIsTesting){
	  process_login(user_id, pass, true, email);
  }

	// Clear the user and pass fields
	$('#reg-user').val("");
	$('#reg-email').val("");
	$('#reg-pass').val("");
	$('#reg-confirm').val("");
  return true;
}

// Process a login request.
// This also handles new registration requests via the new_user optional parameter.
function process_login(user_id, pass, new_user, email)
{
	// Logging in normally
	if (typeof new_user === 'undefined' || !new_user)
	{
		Meteor.loginWithPassword(user_id, pass, function(error)
		{
			if (error){
				show_error(get_lang("errors.bad_login"));
        //TEST
        loginCredentialsFailCallback(false);
			}else{
        //TEST
        loginCredentialsPassCallback(true);
				process_login_more();
		  }
		});
	}

	// Creating an account
	else
	{
		Accounts.createUser({username: user_id, password: pass, email: email});
    //TEST
    registerPassCallback(true);
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
	// Update the allowed media
	Meteor.call('getMedia', Meteor.userId(), "/public", function (error, result)
	{
	        // Handle problems
        	if (error != undefined)
        	{
                	alert("Fatal: Can't find the media folder.\nMake sure you've created a " + mediaPath + " folder!");
                	return;
        	}

        	// Fill the session variables with the media we found
        	Session.set("video-contents", result.video);
        	Session.set("audio-contents", result.audio);
        	Session.set("picture-contents", result.picture);
	});

	// Update Tabs
	$('#tab-audio').show();
	$('#tab-video').show();
	$('#tab-picture').show();
	$('#tab-logout').show();
	$('#tab-login').hide();
	$('#tab-editProfile').show();

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
	$('#tab-editProfile').hide ();

	// Clear any error message
	clear_error();

	// Load the Home Tab
	// This one might be overriden by the template href call
	// since we logout by clicking a link
	$('#tab-home a').tab('show');
}

// Send forgot password e-mail
function send_forgot_pass_email()
{
	Meteor.call('send_reset_email', $('#help-forgot-email').val());
}

// === Profile logic file =============================================
// All profile-related procedures and template events are stored here.

// Template Definition ----------------------------------------------
Template.profile.events(
{
	'click #profile-save': function()
	{
		var old_pass = $('#profile-password').val();
		var new_pass = $('#profile-newpassword').val();
		var cnf_pass = $('#profile-confirmpass').val();

		if (new_pass != cnf_pass)
			show_error("Bad confirmation.");

		if (old_pass == "" || new_pass == "" || cnf_pass == "")
			show_error("No empty fields.");

		Accounts.changePassword(old_pass, new_pass);
	}
});


// Function Definition ----------------------------------------------


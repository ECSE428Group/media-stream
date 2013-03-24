// === Profile logic file =============================================
// All profile-related procedures and template events are stored here.

// Template Definition ----------------------------------------------
Template.profile.events({
	'click #profile-save': function(){

		var old_pass = $('#profile-password').val();
		var new_pass = $('#profile-newpassword').val();
		var cnf_pass = $('#profile-confirmpass').val();
		var username = $('#profile-username').val();
		var email = $('#profile-email').val();
		
		//clear old error messages
		//clear_error();

		//if nothing is entered
		if(old_pass == "" && new_pass=="" && cnf_pass=="" && username=="" && email==""){
			//show error - you must enter information in order to make changes to you profile
			show_error(get_lang("errors.enter_info"));
		}
		if(old_pass != ""){
			if(new_pass != ""){
				if(cnf_pass != ""){
					if(cnf_pass == new_pass){
						if (new_pass.length < Session.get("min_password")){
							show_error(get_lang("errors.pass_short"));
						}else if (new_pass.length > Session.get("max_password")){
							show_error(get_lang("errors.pass_long"));
						}else{
							
							Accounts.changePassword(old_pass, new_pass, function(error){
							if(error){
								//error, could not find old password in database
							show_error(get_lang("errors.no_old_pass"));
							}else{
								//successful change of password
								$('#profile-password').val("");
								$('#profile-newpassword').val("");
								$('#profile-confirmpass').val("");

								//show message saying successful change of password!!
							show_error(get_lang("success.password_change"));

							}

							});
						}
					}else{
						//error, new password and confirm password do not match
						show_error(get_lang("errors.pass_mismatch"));	
					}

				}else{
					//error, need to enter all 3 fields of password
					show_error(get_lang("errors.fill3fields"));
				}			
			}else{
				//error need to enter all 3 fields of password	
				show_error(get_lang("errors.fill3fields"));
			}
		}else if(new_pass != "" || cnf_pass != ""){
			//error need to enter all 3 fields of password
			show_error(get_lang("errors.fill3fields"));
		}


		if(username != ""){
			if (username.length < Session.get("min_username")){
				show_error(get_lang("errors.name_short"));
			}else if (username.length > Session.get("max_username")){
				show_error(get_lang("errors.name_long"));
			}else{
				//change username
				Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name":username}});

				show_error(get_lang("success.username_change"));
				$('#profile-username').val("");
			}
		}

		if(email != ""){
			//change email
			Meteor.users.update({_id:Meteor.user()._id}, {$set:{"emails":{address:email,"verified":false}}});

			show_error(get_lang("success.email_change"));
			$('#profile-email').val("");
		}
	},

	'click #profile-cancel': function(){

		//remove all entries
		$('#profile-username').val("");
		$('#profile-email').val("");
		$('#profile-password').val("");
		$('#profile-newpassword').val("");
		$('#profile-confirmpass').val("");

		// Clear any error message
		clear_error();

		// Load the Home Tab
		$('#tab-home a').tab('show');
	} 
});


// Function Definition ----------------------------------------------


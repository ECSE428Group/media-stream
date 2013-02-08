// Session Stuff ========================================
Session.set("video-contents",[]);
Session.set("audio-contents",[]);
Session.set("picture-contents",[]);
Session.set("errors",[]);
Session.set("audioview360",{show:false,type:"Inline View"});

// Global Variables =====================================
var defined = false;

// Template Processing ==================================
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
	// Clear any error
	'click': function()
	{
		clear_error();
	},

	'click #tab-login': function()
	{
		process_logout();
	}
});

Template.error.errorStatement = function () {
  return Session.get("errors");
};

Template.audiogrid.inline = function () {
  return Session.get("audioview360");
};

Template.videogrid.contents = function () {
  return Session.get("video-contents");
};

Template.audiogrid.contents = function () {
  return Session.get("audio-contents");
};


Template.picturegrid.contents = function(){
	return Session.get("picture-contents");
	
}
Template.picturegrid.rendered = function(){
	window.Code.PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), {} );
}

Template.videogrid.events({
  'click': function (data) {
    $('#player-content').empty();
    var file = data.currentTarget.innerText;
    videoPlayerInit(file);
  },
  'touchstart': function (data) {
    $('#player-content').empty();
    var file = data.currentTarget.innerText;
    videoPlayerInit(file);
  }
});

Template.audiogrid.events({
  
  'click #audioButton': function () {
    var audioview360 = Session.get("audioview360");
    if(audioview360.result == true){ 
      audioview360.result = false;
      audioview360.type = "Inline View";
      Session.set("audioview360",audioview360);
    }else{
     audioview360.result = true;
     audioview360.type = "360 View";
     Session.set("audioview360",audioview360);
    }
    
    return false;
  },
  
  'click': function (data) {
    try{
      var results = Session.get("audioview360");
      if(results.result){
       inlinePlayer.init();
      }else{
        threeSixtyPlayer.init();
      }
    }catch (err){
     show_error(get_lang("errors.audio") + err);
    }
  }
});

Template.loginpage.events({

	// LOGIN ====================================================
	'click #login-submit': function()
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
	},

	// REGISTRATION ============================================
	'click #reg-submit': function()
	{
		// Grab Values
		var user_id = $('#reg-user').val();
		var pass = $('#reg-pass').val();
		var confirm = $('#reg-confirm').val();

		// Are all fields filled
		if (user_id == "" || pass == "" || confirm == "")
		{
			show_error(get_lang("errors.fill_fields"));
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
});

var mediaPath = "public/";
Meteor.call('getMedia', mediaPath, function (error, result) {
  if (error != undefined) {
    alert("Fatal: Can't find the media folder.\nMake sure you've created a " + mediaPath + " folder!");
    return;
  }
  Session.set("video-contents", result.video);
  Session.set("audio-contents", result.audio);
  Session.set("picture-contents", result.picture);
});


function videoPlayerInit(file) {
  var mobile = ( navigator.userAgent.match(/(android|iPad|iPhone|iPod)/i) ? true : false );
      getSelectedFile(file);
      if (!mobile){
        if(!isHTMLSupported(file)){
          if(isDIVXSupported){
            addDivx(file);
          }
        }
        else {
            $('#select-modal').addClass("show");
            $(".video-modal .close").click(function(){
              $(this).closest(".video-modal").removeClass("show");
              $(this).next('video').get(0).pause();
            });
          }
      } else{
          $('video').get(0).load();
          $('#select-modal').addClass("show");
          $('video').get(0).play();
    }
}

function getSelectedFile(file) {
          var videoNode = document.querySelector('video');
          videoNode.src = file;
  }

function addDivx(file){
  var code = '<center> \
          <object id="ie_plugin" classid="clsid:67DABFBF-D0AB-41fa-9C46-CC0F21721616" \
            width="660" \
            height="300" \
            codebase="http://go.divx.com/plugin/DivXBrowserPlugin.cab"> \
          <param name="custommode" value="stage6" /> \
          <param name="autoPlay" value="false" /> \
          <param name="src" value="'+ file +'" /> \
          <param name="bannerEnabled" value="false" /> \
          <embed id="np_plugin" type="video/divx" \
          src="'+file+'" \
          custommode="stage6" \
          width="660" \
          height="300" \
          autoPlay="false" \
          bannerEnabled="false" \
          pluginspage="http://go.divx.com/plugin/download/"> \
          </embed> \
          </object> \
          </center>';

    var divx= document.createElement('div');
    divx.innerHTML= code;
    document.getElementById('player-content').appendChild(divx);
}

function isHTMLSupported(path) {
  var supportedFiletypes = [ ".mp4" ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}

function isDIVXSupported(path) {
  var supportedFiletypes = [ ".avi", ".mkv", ".divx" ];
  for (var i = 0; i < supportedFiletypes.length; i++) {
    if (path.indexOf(supportedFiletypes[i]) != -1) {
      return true;
    }
  }
  return false;
}

// Log-In Processing
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
// This is an attempt at keeping things tidy.
function process_login_more()
{
	// Update Tabs
	$('#tab-audio').show();
	$('#tab-video').show();
	$('#tab-picture').show();
	$('#tab-login a').text(get_lang("buttons.logout"));

	// Clear any error message
	clear_error();
}

// Log-Out Processing
function process_logout()
{
	Meteor.logout();

	// Update Tabs
	$('#tab-audio').hide();
	$('#tab-video').hide();
	$('#tab-picture').hide();
	$('#tab-login a').text(get_lang("buttons.login"));

	// Clear any error message
	clear_error();
}

// Use this function to display an error message to the user.
// Errors are cleared every time. To send multiple errors, concatenate them.
// Also, use the get_lang function to get global error messages.
function show_error(err_string)
{
	var errors = [];
	errors.push(err_string);
	Session.set("errors", errors);
}

// Clears the error message
function clear_error()
{
	Session.set("errors", []);
}

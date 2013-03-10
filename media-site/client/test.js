var thisIsTesting = false;
var toUse = ""+ Math.floor(Math.random() * 1000000000);
Template.homepage.events(
{
  'click #runtests': function ()
  {

	
	thisIsTesting = true;
	console.log("Tests are running");
	console.log(result(audioFilescheck()) + "-audioFilescheck");
	console.log(result(videoFilescheck()) + "-videoFilescheck");
	console.log(result(pictureFilescheck()) + "-pictureFilescheck");
	console.log(result(loginCredentialsEmpty()) + "-loginCredentialsEmpty");
	console.log(result(loginCredentialsNotEmpty()) + "-loginCredentialsNotEmpty");
	console.log(result(shortUsernameFails()) + "-shortUsernameFails");
	console.log(result(shortPasswordFails()) + "-shortPasswordFails");
	console.log(result(mismatchPasswordFails()) + "-mismatchPasswordFails");
	console.log(result(validCredentialsPass()) + "-validCredentialsPass");

	//Async Tests
	loginCredentialsFail();
	registerPass();
	loginCredentialsPass();
	thisIsTesting = false;
  }
});

//helper for displaying results
function result(r){
	if(r == true){
		return "Successful";
	}else{
		return "Failed";
	}
}
//These will be call back for cases of asyncFunctions
function loginCredentialsFailCallback(r){
	console.log(result(!r) + "-loginCredentialsFail");

}
function registerPassCallback(r){
	console.log(result(r) + "-registerPass");

}
function loginCredentialsPassCallback(r){
	console.log(result(r) + "-loginCredentialsPass");
}


//The following are test functions
function loginCredentialsPass(){
	//we want it to be true
	return process_login(toUse,toUse);

}
function registerPass(){
	//we want it to be true
	return process_login(toUse,toUse,true,toUse);

}
function validCredentialsPass(){
	//assuming these do not exist
	$('#reg-user').val("123456");
	$('#reg-email').val("123456");
	$('#reg-pass').val("123456");
	$('#reg-confirm').val("123456");

	//we want it to be true
	return prepare_register();

}
function mismatchPasswordFails(){
	//assuming these do not exist
	$('#reg-user').val("123456");
	$('#reg-email').val("123456");
	$('#reg-pass').val("123456");
	$('#reg-confirm').val("654321");

	//we want it to be true
	return !prepare_register();

}
function shortPasswordFails(){
	//assuming these do not exist
	$('#reg-user').val("123456");
	$('#reg-email').val("123456");
	$('#reg-pass').val("12");
	$('#reg-confirm').val("12");

	//we want it to be true
	return !prepare_register();

}
function shortUsernameFails(){
	//assuming these do not exist
	$('#reg-user').val("12");
	$('#reg-email').val("123456");
	$('#reg-pass').val("123456");
	$('#reg-confirm').val("123456");

	//we want it to be true
	return !prepare_register();

}
function loginCredentialsFail(){
	//assuming these do not exist
	var user = "123";
	var pass = "123";
	var newUser = false;
	var email = "123";
	//we want it to be true
	return process_login(user,pass);

}

function loginCredentialsNotEmpty(){
	$('#login-user').val("123");
	$('#login-pass').val("132");
	//we want it to be true
	return prepare_login();

}
function loginCredentialsEmpty()
{
	$('#login-user').val("");
	$('#login-pass').val("");
	//we want it to be false
	return !prepare_login();
}
function audioFilescheck()
{
  	var check = true;
	var list = Template.audiogrid.contents();
        var supportedFiletypes = [ ".mp3", ".wav", ".wma", "ogg" ];
        for (var i = 0; i < list.length ; i++){
          var found = false;
          for(var j = 0; j < supportedFiletypes.length; j++){
            if (list[i].indexOf(supportedFiletypes[i]) != -1){
              found = true;
              break;
            }
          }
          if(!found){
            check = false;
          }
        }
	return check;
}

function videoFilescheck()
{
  	var check = true;
	var list = Template.videogrid.contents();
        var supportedFiletypes = [ ".mp4", ".avi", ".mov", ".mkv" ];
        for (var i = 0; i < list.length ; i++){
          var found = false;
          for(var j = 0; j < supportedFiletypes.length; j++){
            if (list[i].indexOf(supportedFiletypes[i]) != -1){
              found = true;
              break;
            }
          }
          if(!found){
            check = false;
          }
        }
	return check;
}


function pictureFilescheck()
{
  	var check = true;
	var list = Template.picturegrid.contents();
    	var supportedFileTypes = [".jpg",".png",".gif",".bmp"];
        for (var i = 0; i < list.length ; i++){
          var found = false;
          for(var j = 0; j < supportedFiletypes.length; j++){
            if (list[i].indexOf(supportedFiletypes[i]) != -1){
              found = true;
              break;
            }
          }
          if(!found){
            check = false;
          }
        }
	return check;
}

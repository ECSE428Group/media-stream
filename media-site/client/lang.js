// Localization file.
// Adaptation of https://gist.github.com/3261055

// Okay, we might not need this one for actual localization,
// but at least this will keep strings consolidated to one file.
// This means it becomes very easy to change strings.
// We won't have to look for them in templates.

// WARNING: Do not use templates in the <head> tags.
// Meteor does not support dynamic <head> tags yet apparently.
// (see https://github.com/meteor/meteor/issues/266)

// Setting global variables between client and server is a royal pain.
// If these need to change, edit client/main.js and server/main.js too.
var min_username = "3";
var max_username = "15";
var min_password = "5";
var max_password = "15";

// Language Array
var language_array =
{
  // === General website strings ===
  "site":
  {
    "name":  { "en": "Media Site", "fr": "Media Site" }
  },

  // === Strings appearing on buttons ===
  "buttons":
  {
    // Menu Items
    "home":    { "en": "Home",     "fr": "Accueil" },
    "video":   { "en": "Video",    "fr": "Video" },
    "audio":   { "en": "Audio",    "fr": "Audio" },
    "picture": { "en": "Image",    "fr": "Image" },
    "login":   { "en": "Sign In",  "fr": "Connexion" },
    "logout":  { "en": "Sign Out", "fr": "Deconnexion" },

    // UI Buttons
    "help":       { "en": "Help",                    "fr": "A l'aide" },
    "help-close": { "en": "I'm fine",                "fr": "Fermer" },
    "send-me":    { "en": "Just send it already...", "fr": "Envoyez-le moi!" },
    "register":   { "en": "Sign Up",                 "fr": "Enregistrez-vous" }
  },

  // === Captions and Labels and stuff ===
  "labels":
  {
    // Text boxes
    "username": { "en": "Username", "fr": "Pseudo" },
    "password": { "en": "Password", "fr": "Mot de passe" },
    "confirm":  { "en": "Confirm",  "fr": "Confirmation" },
    "email":    { "en": "E-mail",   "fr": "Courriel" },
    
    // Dialog text
    "help-login": {
                    "en": "Did you <b>really</b> just forget your password?<br /><br />Guess that's what you get for picking such a difficult one to remember.<br />Serves you right.<br /><br />Suppose we <i>could</i> send you a link to reset it by e-mail.<br />Promise you won't forget it this time?",
                    "fr": "Nous pouvons vous envoyer votre mot de passe par courriel."
                  }
  },

  "headings":
  {
    // Headings
    "home":       { "en": "Media Site - BUILD 164", "fr": "Media Site" },
    "video":      { "en": "My Videos",  "fr": "Mes Videos" },
    "audio":      { "en": "My Audio",   "fr": "Ma Musique" },
    "picture":    { "en": "My Images",  "fr": "Mes Photos" },
    "login":      { "en": "LOGIN",      "fr": "CONNEXION" },
    "register":   { "en": "REGISTER",   "fr": "NOUVEAU COMPTE" },

    // Dialog Titles
    "help-login": { "en": "Help! I can't login!", "fr": "A l'aide!" },

    // Sub Headings
    "home_sub":   {
                    "en": "Welcome to my Media Site!",
                    "fr": "Bienvenue sur mon Media Site!"
                  },
    "video_sub":  {
                    "en": "Check out my videos below!",
                    "fr": "Regarde mes videos!"
                  }
  },

  "errors":
  {
    "title":          {
                        "en": "Hey, listen!",
                        "fr": "Attention!"
                      },

    "bad_login":      {
                        "en": "Couldn't log you in! Bad username/password combination.",
                        "fr": "Votre combinaison pseudo/mot de passe ne fonctionne pas."
                      },

    "pass_mismatch":  {
                        "en": "Your passwords don't match.",
                        "fr": "Vos mots de passe sont differents."
                      },

    "user_exists":    {
                        "en": "Couldn't create an account for you! This username's already taken.",
                        "fr": "Ce pseudo est deja utilise."
                      },

    "fill_fields":    {
                        "en": "Please fill all fields.",
                        "fr": "SVP remplir tous les champs."
                      },

    "name_short":     {
                        "en": "Your username's too short! Don't be shy now, make one between " + min_username + "  and " + max_username +  " characters.",
                        "fr": "Votre pseudo est trop court! Choisissez-en un entre " + min_username +  " et " + max_username + " characteres."
                      },

    "pass_short":     {
                        "en": "A password this short would be way too easy to guess, no? Pick one between " + min_password  + " and " + max_password + " characters.",
                        "fr": "Votre mot de passe est trop court! Choisissez-en un entre " + min_password + " et " + max_password + " characteres."
                      },

    "name_long":      {
                        "en": "C'mon, shorten your username: this isn't a novel! Make one between " + min_username + " and " + max_username + " characters.",
                        "fr": "Votre pseudo est trop long! Choisissez-en un entre " + min_username + " et " + max_username + " characteres."
                      },

    "pass_long":      {
                        "en": "How do you even remember a password this long? One between " + min_password + " and " + max_password + " characters will do fine!",
                        "fr": "Votre mot de passe est trop long! Choisissez-en un entre " + min_password + " et " + max_password + " characteres."
                      },

    "audio":          {
                        "en": "There was an error with the audio playback: ",
                        "fr": "Il y a eu un probleme avec l'audio: "
                      },
											
		"picture":				{
												"en": "There was an error while loading the pictures - ",
												"fr": "Il y a eu un problem lors du chargement des images - "
											},
    "video":        {
                        "en": "There was an error while loading the video - ",
                        "fr": "Il y a eu un problem lors du chargement des video - "
                      },

    "enter_info":        {
                        "en": "You must enter information in order to edit your profile.",
                        "fr": "Ajouter de l'information pour modifier votre profile. "
                      },

    "no_old_pass":        {
                        "en": "The old password you entered was not found in the database.",
                        "fr": "Le mot de passe que vous avez inscrit n'est pas dans la base de donees."
                      },

    "fill3fields":        {
                        "en": "Fill out all the fields relating to password in order to change your password.",
                        "fr": "Il faut remplir tout les boites qui on a faire avec votre mot de passe pour modifier votre mot de passe."
                      }

     },

"success":
  {
    "password_change": {
                        "en": "Your password has been changed!",
                        "fr": "Ton mot de passe a ete change!"
                      },

    "username_change": {
                        "en": "Your name has been changed!",
                        "fr": "Ton nom a ete change!"
                      },

    "email_change": {
                        "en": "Your email has been changed!",
                        "fr": "Ton courriel a ete change!"
                      }
  }
};

// === FUNCTIONS ==============================================
function get_lang(string_id)
{
	// [REMOVE] Have this work with user sessions, or browser local storage
	var user_lang = "en";

	// Get the string using the specified string ID
	// and check for sub-strings for added clarity
	string_id = string_id.split(".");
	var str = language_array[string_id[0]];

	// Find the string in the language array by
	// looping through the sub-strings and shrinking the
	// str array until we focus on the one we want
	for (i in string_id)
	{
		// Get sub-strings
		if (i > 0)
			str = str[string_id[i]];
	}

	// Get the string based on the  user's localization settings
	str = str[user_lang];

	// Return the localized string
	return str;
}
try{
// Register the string template call
Handlebars.registerHelper("string", function(string_id)
{
	return get_lang(string_id);
});
} catch(err){
  console.log(err);
}

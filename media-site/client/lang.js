// Localization file.
// Adaptation of https://gist.github.com/3261055

// Okay, we might not need this one for actual localization,
// but at least this will keep strings consolidated to one file.
// This means it becomes very easy to change strings.
// We won't have to look for them in templates.

// WARNING: Do not use templates in the <head> tags.
// Meteor does not support dynamic <head> tags yet apparently.
// (see https://github.com/meteor/meteor/issues/266)

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
    "home":      { "en": "Home",     "fr": "Accueil" },
    "video":     { "en": "Video",    "fr": "Video" },
    "audio":     { "en": "Audio",    "fr": "Audio" },
    "picture":   { "en": "Image",    "fr": "Image" },
    "login":     { "en": "Sign In",  "fr": "Connexion" },
    "register":  { "en": "Sign Up",  "fr": "Enregistrez-vous" },
    "logout":    { "en": "Sign Out", "fr": "Deconnexion" }

    // Submit Buttons
  },

  // === Captions and Labels and stuff ===
  "labels":
  {
    // Text boxes
    "username":  { "en": "username",   "fr": "pseudo" },
    "password":  { "en": "password",   "fr": "mot de passe" },
    "confirm":   { "en": "pass again", "fr": "confirmation" }
  },

  "headings":
  {
    "login":     { "en": "LOGIN",    "fr": "CONNEXION" },
    "register":  { "en": "REGISTER", "fr": "NOUVEAU COMPTE" }
  },

  "errors":
  {
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

    "audio":          {
                        "en": "There was an error with the audio playback: ",
                        "fr": "Il y a eu un probleme avec l'audio: "
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

// Register the string template call
Handlebars.registerHelper("string", function(string_id)
{
	return get_lang(string_id);
});

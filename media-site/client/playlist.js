function createPlaylist(event,template,type){
  var name, type;
  switch(type){
    case "video":
      name = $(event.target).prev().val();
      type = "video";
      break;
    case "audio":
      name = $(event.target).prev().val();
      type = "audio";
      break;
    case "picture":
      name = $(event.target).prev().val();
      type = "picture";
      break;
  }
  
  if(name){
    Meteor.call('createPlaylist',name,type,function(error,result){
      if(!result){
        show_success("Successfully created playlist");
      }else{
        show_error("Playlist with the same name already exists.");
      }
    });
  }else{
    show_error("You need to specify a name for the playlist.\n");
  }
}

function addToPlaylist(event,template,type){
  var stringToRemove = "Add to ";
  var playlistName, fileName;
  
  switch(type){
    case "video":
      playlistName = event.target.innerHTML.substr(stringToRemove.length);
      fileName = $(event.target).closest('.thumbnail').find('.videobox').first().text();
      break;
    case "audio":
      playlistName = event.target.innerHTML.substr(stringToRemove.length);
      fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
      break;
    case "picture":
      playlistName = event.target.innerHTML.substr(stringToRemove.length);
      fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
      break;
  }
  
  Meteor.call('addToPlaylist',playlistName,fileName,function(error,result){
    if(result){
      show_success("Successfully added to playlist");
    }else{
      show_error("This file already exists in the playlist.");
    }
  });
}

function removeFromPlaylist(event, template, type){
  var stringToRemove = "Remove from ";
  var playlistName, fileName;
  
  switch(type){
    case "video":
      playlistName = event.target.innerHTML.substr(stringToRemove.length);
      fileName = $(event.target).closest('.thumbnail').find('.videobox').first().text();
      break;
    case "audio":
      playlistName = event.target.innerHTML.substr(stringToRemove.length);
      fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
      break;
    case "picture":
      playlistName = event.target.innerHTML.substr(stringToRemove.length);
      fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
      break;
  }
  
  Meteor.call('removeFromPlaylist',playlistName,fileName,function(error,result){
    if(result){
      show_success("Successfully removed from playlist");
    }else{
      show_error("The file does not belong to this playlist");
    }
  });
}

function viewPlaylist(event,template,type){ 
  var playlistName, contentContainer;
  switch(type){
    case "video":
      playlistName = event.target.innerHTML;
      contentContainer = "video-contents";
      break;
    case "audio":
      playlistName = event.target.innerHTML;
      contentContainer = "audio-contents";
      break;
    case "picture":
      playlistName = event.target.innerHTML;
      contentContainer = "picture-contents";
      break;
  }
  
  Meteor.call('getSpecificPlaylist',playlistName,function(error,result){
    if(result){
      Session.set(contentContainer,result);
    }else{
      show_error("An error occured while retrieving the results");
    }
  });
}

//Need to look into this. Normally, this should not be needed as changes to the 
//database automatically cause the page to update. Problem could be due to 
//disabling of autopublish.
function updatePlaylists(){
  Meteor.call('getPlaylists',function(error,result){
	Session.set("video-playlists",result.video);
    Session.set("audio-playlists",result.audio);
    Session.set("picture-playlists",result.picture);
  });
}
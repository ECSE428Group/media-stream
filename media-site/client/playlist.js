function createPlaylist(event,template,type){
  switch(type){
    case "video":
      var name = $('#buttonMenuVid .playlistName').val();
      if(name){
        Meteor.call('createPlaylist',name,"video",function(error,result){
          if(!result){
            show_success("Successfully created playlist");
            $('#buttonMenuVid .playlistName').val("");
          }else{
            show_error("Playlist with the same name already exists.");
          }
        });
      }else{
          show_error("You need to specify a name for the playlist.\n");
      }
      break;
    case "audio":
      var name = $('#buttonMenuAudio .playlistName').val();
      if(name){
        Meteor.call('createPlaylist',name,"audio",function(error,result){
          if(!result){
            show_success("Successfully created playlist");
            $('#buttonMenuAudio .playlistName').val("");
          }else{
            show_error("Playlist with the same name already exists.");
          }
        });
      }else{
          show_error("You need to specify a name for the playlist.\n");
      }
      break;
    case "picture":
      var name = $('#buttonMenuPic .playlistName').val();
      if(name){
        Meteor.call('createPlaylist',name,"picture",function(error,result){
          if(!result){
            show_success("Successfully created playlist");
            $('#buttonMenuPic .playlistName').val("");
          }else{
            show_error("Playlist with the same name already exists.");
          }
        });
      }else{
        show_error("You need to specify a name for the playlist.\n");
      }
      break;
  }
}

function addToPlaylist(event,template,type){
  switch(type){
    case "video":
      var stringToRemove = "Add to ";
      var playlistName = event.target.innerHTML.substr(stringToRemove.length);
      var fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().text();
      Meteor.call('addToPlaylist',playlistName,fileName,function(error,result){
        if(result){
          show_success("Successfully added to playlist");
        }else{
          show_error("This file already exists in the playlist.");
        }
      });
      break;
    case "audio":
      var stringToRemove = "Add to ";
      var playlistName = event.target.innerHTML.substr(stringToRemove.length);
      var fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
      Meteor.call('addToPlaylist',playlistName,fileName,function(error,result){
        if(result){
          show_success("Successfully added to playlist");
        }else{
          show_error("This file already exists in the playlist.");
        }
      });
      break;
    case "picture":
      var stringToRemove = "Add to ";
      var playlistName = event.target.innerHTML.substr(stringToRemove.length);
      var fileName = $(event.target).closest('.thumbnail').find('.imgContainer').find('a').first().attr('href');
      Meteor.call('addToPlaylist',playlistName,fileName,function(error,result){
        if(result){
          show_success("Successfully added to playlist");
        }else{
          show_error("This file already exists in the playlist.");
        }
      });
      break;
  }
}

function viewPlaylist(event,template,type){ 
  switch(type){
    case "video":
      var playlistName = event.target.innerHTML;
      Meteor.call('getSpecificPlaylist',playlistName,function(error,result){
        if(result){
          Session.set("video-contents",result);
        }else{
          show_error("An error occured while retrieving the results");
        }
      });
      break;
    case "audio":
      var playlistName = event.target.innerHTML;
      Meteor.call('getSpecificPlaylist',playlistName,function(error,result){
        if(result){
          Session.set("audio-contents",result);
        }else{
          show_error("An error occured while retrieving the results");
        }
      });
      break;
    case "picture":
      var playlistName = event.target.innerHTML;
      Meteor.call('getSpecificPlaylist',playlistName,function(error,result){
          if(result){
              Session.set("picture-contents",result);
          }else{
              show_error("An error occured while retrieving the results");
          }
      });
      break;
  }
}
function search(event,template,type){ 
  var searchString, contentContainer, type;
  switch(type){
    case "video":
      searchString = $(event.target).prev().val();
      type = "video";
      contentContainer = "video-contents";
      break;
    case "audio":
      searchString = $(event.target).prev().val();
      type = "audio";
      contentContainer = "audio-contents";
      break;
    case "picture":
      searchString = $(event.target).prev().val();
      type = "picture";
      contentContainer = "picture-contents";
      break;
  }
  if(searchString){
    Meteor.call('keywordSearch',searchString,type,function(error,result){
      if(result){
        Session.set(contentContainer,result);
      }else{
        show_error("An error occured while retrieving the results");
      }
    });
  }
}
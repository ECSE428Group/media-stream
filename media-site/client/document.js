var showModal = false;
Template.documentgrid.contents = function ()
{
  return Session.get("document-contents");
};

Template.documentpage.events({
  'click #documentgrid' : function(data)
  {
     var result = data.currentTarget.innerText; 
     $('#docuModalLabel').text(result);
     Meteor.call('readFile',result,function(error, result)
     {
     	if(error)
     	{
     		console.log(error);
     	}
     	else{
     		$('#docuModalBody').val(result);
     	}

     });
  },
 'click #closeModal' : function(data)
 {
    $('#docuModalBody').attr('readonly',true);
    $('#Edit-Save').text("Edit");
 },
 'click #Edit-Save' : function(data)
  {
    var button = data.currentTarget.innerText;

    if( button == "Edit")
    {
        $('#docuModalBody').attr('readonly',false);
        $('#Edit-Save').text("Save"); 
    }
    else {
        var file = $('#docuModalLabel').text();
        var result = $('#docuModalBody').val();
        Meteor.call('writeFile', file, result,function(error, result)
        {
            if(error)
            {
             console.log(error);
            }
            else{
             
            }

        });

        $('#docuModalBody').attr('readonly',true);
        $('#Edit-Save').text("Edit");
    }

  }
});

$(document).ready(function() {

  $('.delete-link').on('click', function(e) {

    console.log(e.target.parentNode.id);
    var url = "/playlists/" + e.target.parentNode.id;

    $.ajax({
      method: 'DELETE',
      url: url
    }).done(function(data) {
      $(e.target).parent().remove();
    });

  });

});
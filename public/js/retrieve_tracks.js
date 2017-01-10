$(document).ready(function() {




  // STORE THE SENTENCE ON SUBMIT

  $('#search-form').submit(function(event) {
    event.preventDefault();

    // Get submission and separate the words

    var searchTerm = $('#sentence').val();
    searchTermSplit = searchTerm.split(" ");

    // For each word in submission, get track whose title matches 

    function getTracks(arr) {
      for (var i=0; i<arr.length; i++) {
        var resultJSON = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"' + arr[i] + '"');
        trackInfo(resultJSON);
      }
    }

    // Get track info and append it to results

    function trackInfo(url) {
      ran = Math.floor(Math.random()*20);
      $.getJSON(url, function(json) {
        var track = json.tracks.items[ran].name;
        var artist = json.tracks.items[ran].artists[0].name;
        var album = json.tracks.items[ran].album.name;
        var cover = json.tracks.items[ran].album.images[2].url;

        $('#tracks').append(
          "<div class='track'>" +
            "<img src='" + cover + "' alt='" + album + "'>" +
            "<div class='track-details'>" +
              '<h4>' + track + '</h4>' +
              '<p>Album: ' + album + '</p>' +
              '<p>Artist: ' + artist + '</p>' +
            '</div>' +
          '<div>'
        );

      });
    }

    getTracks(searchTermSplit);

  });

});
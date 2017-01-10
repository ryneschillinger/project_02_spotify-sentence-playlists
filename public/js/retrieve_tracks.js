$(document).ready(function() {

  $('#search-form').submit(function(event) {
    event.preventDefault();

    // Get submission and separate the words
    var searchTerm = $('#sentence').val();
    searchTermSplit = searchTerm.split(" ");

    // Remove empty spaces from sentence array
    for (var i = searchTermSplit.length - 1; i >= 0; i--) {
      if (searchTermSplit[i] == "") {
        searchTermSplit.splice(i,1);
      }
    }

    // For each word in submission, get track whose title matches that word

    function getTracks(arr) {
      for (var i=0; i<arr.length; i++) {
        var resultJSON = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"' + arr[i] + '"');
        addTracks(resultJSON, arr[i]);
      }
    }

    // Collect track info and append it to results list

    function addTracks(url, word) {

      $.getJSON(url, function(json) {

        var numResults = json.tracks.items.length;
        var allResults = [];
        var ran = Math.floor(Math.random()*numResults);

        // Return error if no match found
        if (!json.tracks.items[ran]) {
          var errorMessage = "No match found for the word ''" + word + "''";
          $("#error").text(errorMessage);
        }

        // Return only short track names and ignore empty results
        for (var i = 0; i < numResults; i++) {
          allResults.push(json.tracks.items[i].name);
        }

        var track = json.tracks.items[ran].name;

        while (track.length > 15) {
          // Ignore empty results
          if (!track) {
            break;
          }
          // If track name is longer than 20 characters, look for shorter one
          else if (track.length > 15) {
            for (var i = 0; i < numResults; i++) {
              if (allResults[i].length < 15) {
                track = allResults[i];
                break;
              }
              // If all track names are long, pick one at random
              else if (i == numResults - 1) {
                track = allResults[ran];
                break;
              }
            }
            break;
          }
          // Otherwise, get shorter track name from results
          else {
            ran = Math.floor(Math.random()*numResults);
            track = json.tracks.items[ran].name;
          }
        }

        var artist = json.tracks.items[ran].artists[0].name;
        var album = json.tracks.items[ran].album.name;
        var cover = json.tracks.items[ran].album.images[2].url;

        // Add track info to results
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
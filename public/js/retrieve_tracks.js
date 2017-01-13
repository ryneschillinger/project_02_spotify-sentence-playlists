$(document).ready(function() {

  console.log("hollatchaboy");

  $('#search-form').submit(function(event) {
    event.preventDefault();

    // Maximum length of track name result
    maxLength = 15;

    // Remove previous search results and reset counts
    $('#results-tracks').empty();
    $('#error').empty();
    var resultJSON = '';
    var wordIndex = 0;


    // Get submission and separate the words
    var searchTerm = $('#sentence').val();
    var form = $("#add-playlist");
    var html = '<input type="hidden" name="playlistname" value="' + searchTerm + '">';
    form.append(html);
    searchTermSplit = searchTerm.split(" ");


    // Remove empty spaces from sentence array
    for (var i = searchTermSplit.length - 1; i >= 0; i--) {
      if (searchTermSplit[i] == "") {
        searchTermSplit.splice(i,1);
      }
    }

    // Change title of playlist in results
    $('#playlist-name').text(searchTerm);


    // For each word in submission, get track whose title matches that word

    function getTracks(arr) {
      for (var i=wordIndex; i<arr.length; i++) {

        // Get track JSON for word
        resultJSON = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"' + arr[i] + '"');

        console.log(i);
        $('#results-tracks').append(
          "<div class='track' id='track" + i + "'></div>"
        );

        addTrack(resultJSON, arr[i]);

      }
    }


    // Collect track info and append it to results list

    function addTrack(url, word) {

      $.getJSON(url, function(json) {

        var numResults = json.tracks.items.length;
        var allResults = [];
        var ran = Math.floor(Math.random()*numResults);

        // Return error if no match found
        if (!json.tracks.items[ran]) {
          var errorMessage = "No match found for the word ''" + searchTermSplit[wordIndex] + "''";
          $("#error").text(errorMessage);
        }

        // Return only short track names and ignore empty results
        for (var i = 0; i < numResults; i++) {
          allResults.push(json.tracks.items[i].name);
        }

        var track = json.tracks.items[ran].name;

        while (track.length > maxLength) {
          // Ignore empty results
          if (!track) {
            break;
          }
          // If track name is longer than 20 characters, look for shorter one
          else if (track.length > maxLength) {
            for (var i = 0; i < numResults; i++) {
              if (allResults[i].length < maxLength) {
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

        var trackLink = json.tracks.items[ran].external_urls.spotify;
        var artist = json.tracks.items[ran].artists[0].name;
        var artistLink = json.tracks.items[ran].artists[0].external_urls.spotify;
        var album = json.tracks.items[ran].album.name;
        var albumLink = json.tracks.items[ran].album.external_urls.spotify;
        var cover = json.tracks.items[ran].album.images[2].url;
    

        // Change background image to match album cover
        if (word == searchTermSplit[0]) {
          $('.background-image').css({"background": "url('" + cover + "')", "background-size": "100%", "background-position": "center"});
        }


        // Add track info to results
        $('#track' + wordIndex).empty();
        $('#track' + wordIndex).append(
          "<a href='" + trackLink + "'>" + "<img src='" + cover + "' alt='" + album + "'></a>" +
          "<div class='track-details'>" +
            "<h4><a href='" + trackLink + "'>" + track + '</a></h4>' +
            '<p>Artist: ' + "<a href='" + artistLink + "'>" + artist + '</a></p>' +
            '<p>Album: ' + "<a href='" + albumLink + "'>" + album + '</a></p>' +
          '</div>'
        );

        // Create hidden form for 
        var form = $("#add-playlist");
        
        var html = '<input type="hidden" name="name" value="' + track + '">';
        html += '<input type="hidden" name="trackLink" value="' + trackLink + '">';
        html += '<input type="hidden" name="artistLink" value="' + artistLink + '">';
        html += '<input type="hidden" name="artist" value="' + artist + '">';
        html += '<input type="hidden" name="albumLink" value="' + albumLink + '">';
        html += '<input type="hidden" name="album" value="' + album + '">';
        html += '<input type="hidden" name="cover" value="' + cover + '">';

        form.append(html);

        // Move on to the next word in results array
        wordIndex++;

      });
    } // End of addTrack function


    // Call main function using the sentence array
    getTracks(searchTermSplit);

  });

});
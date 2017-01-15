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


    // Clear any old submissions, get submission and separate the words into array
    var searchTerm = "";
    searchTerm = $('#sentence').val();
    var searchTermSplit = "";
    searchTermSplit = searchTerm.split(" ");

    // Clear data form
    $("#add-playlist-submit").nextAll().remove();
    var form = $("#add-playlist");
    var html = "<input type='hidden' name='playlistname' class='data-form' value='" + searchTerm + "'>";
    form.append(html);


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
      for (var i=0; i<arr.length; i++) {

        // Create container for track
        $('#results-tracks').append(
          "<div class='track' id='track" + i + "'></div>"
        );

        addTrack(arr[i], i);

      }
    }


    // Collect track info and append it to results list

    function addTrack(word, index) {

      JSONurl = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"' + word + '"');

      $.getJSON(JSONurl, function(json) {

        var numResults = json.tracks.items.length;
        var allResults = [];
        var ran = Math.floor(Math.random()*numResults);

        // ERROR IF NO MATCH FOUND
        if (!json.tracks.items[ran]) {

          //Display error message
          var errorMessage = "No match found for the word ''" + word + "''";
          $("#error").css("visibility", "visible");
          $("#error").text(errorMessage);

          // Remove item from results array and revise playlist name
          var wordToRemove = searchTermSplit.indexOf(word);
          searchTermSplit.splice(wordToRemove,1);
          searchTerm = searchTermSplit.join(" ");

          // Delete container div for matchless word
          $('#track' + index).remove();

          // Change results header
          $('#playlist-result-name').text(searchTerm);

          // Change playlistname value to revised searchTerm
          $(".data-form").attr("value", searchTerm);
        }

        // Get track details from JSON
        var track = json.tracks.items[ran].name;
        var trackLink = json.tracks.items[ran].external_urls.spotify;
        var artist = json.tracks.items[ran].artists[0].name;
        var artistLink = json.tracks.items[ran].artists[0].external_urls.spotify;
        var album = json.tracks.items[ran].album.name;
        var albumLink = json.tracks.items[ran].album.external_urls.spotify;
        var cover = json.tracks.items[ran].album.images[2].url;

        // Return only short track names and ignore empty results
        for (var i = 0; i < numResults; i++) {
          allResults.push(json.tracks.items[i].name);
        }

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
    

        // Change background image to match album cover
        if (word == searchTermSplit[0]) {
          $('.background-image').css({"background": "url('" + cover + "')", "background-size": "100%", "background-position": "center"});
        }


        // Add track info to results
        $('#playlist-result-name').text(searchTerm);
        $('#track' + index).empty();
        $('#track' + index).append(
          "<div class='cover-thumb'>" +
            "<a href='" + trackLink + "' target='_blank'>" + 
            "<i class='fa fa-play-circle' aria-hidden='true'></i>" + 
            "<div class='play-button-fill'></div>" +
            "<img src='" + cover + "' alt='" + album + "'></a>" +
          "</div>" +
          "<div class='track-details'>" +
            "<h4><a href='" + trackLink + "' target='_blank'>" + track + '</a></h4>' +
            '<p>Artist: ' + "<a href='" + artistLink + "' target='_blank'>" + artist + '</a></p>' +
            '<p>Album: ' + "<a href='" + albumLink + "' target='_blank'>" + album + '</a></p>' +
          '</div>'
        );

        // Add data to form
        html = '<input type="hidden" name="name" value="' + track + '">';
        html += '<input type="hidden" name="trackLink" value="' + trackLink + '">';
        html += '<input type="hidden" name="artistLink" value="' + artistLink + '">';
        html += '<input type="hidden" name="artist" value="' + artist + '">';
        html += '<input type="hidden" name="albumLink" value="' + albumLink + '">';
        html += '<input type="hidden" name="album" value="' + album + '">';
        html += '<input type="hidden" name="cover" value="' + cover + '">';
        form.append(html);

      });
    } 


    // Call main function using the sentence array
    getTracks(searchTermSplit);


    //Display Add Playlist Button
    $("#btn-add-playlist").css("visibility", "visible");


  });

});
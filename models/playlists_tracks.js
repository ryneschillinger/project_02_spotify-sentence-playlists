'use strict';
module.exports = function(sequelize, DataTypes) {
  var playlists_tracks = sequelize.define('playlists_tracks', {
    playlist_id: DataTypes.INTEGER,
    track_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return playlists_tracks;
};
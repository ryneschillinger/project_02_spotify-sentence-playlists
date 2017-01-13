'use strict';
module.exports = function(sequelize, DataTypes) {
  var playlists_tracks = sequelize.define('playlists_tracks', {
    playlistId: DataTypes.INTEGER,
    trackId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return playlists_tracks;
};
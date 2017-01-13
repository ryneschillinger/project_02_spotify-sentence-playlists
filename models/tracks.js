'use strict';
module.exports = function(sequelize, DataTypes) {
  var tracks = sequelize.define('tracks', {
    name: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    cover: DataTypes.STRING,
    playlistId: DataTypes.INTEGER,
    trackLink: DataTypes.STRING,
    artistLink: DataTypes.STRING,
    albumLink: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.tracks.belongsToMany(models.playlists, {through: "playlists_tracks"});
      }
    }
  });
  return tracks;
};
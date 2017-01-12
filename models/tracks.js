'use strict';
module.exports = function(sequelize, DataTypes) {
  var tracks = sequelize.define('tracks', {
    name: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    cover: DataTypes.STRING,
    playlist_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tracks;
};
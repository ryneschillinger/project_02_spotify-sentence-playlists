'use strict';
module.exports = function(sequelize, DataTypes) {
  var playlists = sequelize.define('playlists', {
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    cover: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.playlists.hasMany(models.tracks);
      }
    }
  });
  return playlists;
};
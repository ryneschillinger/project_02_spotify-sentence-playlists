'use strict';
module.exports = function(sequelize, DataTypes) {
  var playlists = sequelize.define('playlists', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    cover: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.playlists.hasMany(models.tracks);
        models.playlists.belongsTo(models.users);
      }
    }
  });
  return playlists;
};
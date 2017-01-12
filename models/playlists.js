'use strict';
module.exports = function(sequelize, DataTypes) {
  var playlists = sequelize.define('playlists', {
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    cover: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return playlists;
};
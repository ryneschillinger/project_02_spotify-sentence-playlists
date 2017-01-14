'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('tracks', 'albumLink', Sequelize.STRING).done(function() {
      queryInterface.addColumn('tracks', 'artistLink', Sequelize.STRING).done(function() {
          queryInterface.addColumn('tracks', 'trackLink', Sequelize.STRING).done(function() {
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

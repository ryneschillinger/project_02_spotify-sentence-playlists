var expect = require('chai').expect;
var request = require('supertest');
var app = require('../index');
var db = require('../models');

before(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    done();
  });
});

describe('User Model', function() {
  describe('Creating new users', function() {
    it('should be able to create new users', function(done) {
      db.user.findOrCreate({
        where: { email: 'user@gmail.com' },
        defaults: {
          name: 'User McUserface',
          password: 'regularoldpassword'
        }
      }).spread(function(user, created) {
        expect(created).to.equal(true);
        expect(user.email).to.equal('user@gmail.com');
        expect(user.name).to.equal('User McUserface');
        done();
      });
    });

    it('should reject invalid emails', function(done) {
      db.user.findOrCreate({
        where: { email: 'nopenopenope' },
        defaults: {
          name: 'User McUserface',
          password: 'regularoldpassword'
        }
      }).spread(function(user, created) {
          expect(created).to.equal(false);
          expect(user).to.equal(null);
          done();
      }).catch(function(error) {
        expect(error.message).to.equal('Validation error: Invalid email address');
        done();
      });
    });

    it('should reject short passwords', function(done) {
      db.user.findOrCreate({
        where: { password: '1234567' },
        defaults: {
          name: 'User McUserface',
          email: 'user@gmail.com'
        }
      }).catch(function(error) {
        expect(error.message).to.equal('Validation error: Password must be between 8 and 99');
        done();
      });
    });

    it('should reject long passwords', function(done) {
      db.user.findOrCreate({
        where: { password: 'hixaBVXUlClg06S22OeeQNxHfQJKeiRAY5aC7KcAlOGjXbvHF5okqbIX1DwBxQ2XUFpU0YgBI3BoM9n2THn6OFtXFNHm36OJ1Vta' },
        defaults: {
          name: 'User McUserface',
          email: 'user@gmail.com'
        }
      }).catch(function(error) {
        expect(error.message).to.equal('Validation error: Password must be between 8 and 99');
        done();
      });
    });

  });
});
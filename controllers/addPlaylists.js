var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var ejsLayouts = require("express-ejs-layouts");
var db = require("../models"); 

// // GET - return a page with favorite playlists
// router.get('/pokemon', function(req, res) {
// 	db.pokemon.findAll().then(function(pokemon) {
// 		res.render("./pokemon", {pokemon: pokemon});
// 	});
// });

// app.get('/playlists', isLoggedIn, function(req, res) {
//   res.render('playlists');
// });

// // POST - receive the name of a pokemon and add it to the database
// router.post('/', function(req, res) {
// 	db.pokemon.create(req.body).then(function(pokemon) { 
// 		res.redirect("/pokemon"); 
// 	}); 
// });


module.exports = router;

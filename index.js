// REQUIREMENTS
require('dotenv').config({silent:true});
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');

// APP VARIABLES
var db = require('./models'); 
var app = express();

// SET/USE STATEMENTS
app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static('public'));
app.use(express.static('files'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretpassword',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


// ROUTES

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/create', isLoggedIn, function(req, res) {
  res.render('create');
});

// GET - Show list of all favorited playlists
app.get('/playlists', isLoggedIn, function(req, res) {
  db.playlists.findAll().then(function(playlists) {
  	res.render("playlists", {playlists: playlists});
  });
});

// GET - Show playlist details
app.get('/playlists/:id', function(req, res) {
  db.playlists.findById(req.params.id).then(function(playlists) {
    res.render("playlistShow", {playlists: playlists});
  });
});

// DELETE - remove playlist from list of favorites
app.delete('/playlists/:id', isLoggedIn, function(req, res){
	db.playlists.findById(req.params.id).then(function(playlist) {
		playlist.destroy();
		res.send({message:"successfully deleted"});
	});
});

app.use('/auth', require('./controllers/auth'));

// Heroku looks for the process.env.PORT. Otherwise, it'll fail. 
var server = app.listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000');
});

module.exports = server;

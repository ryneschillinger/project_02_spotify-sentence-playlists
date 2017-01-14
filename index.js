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
    db.playlists.findAll({
      where: { userId: req.user.id },
    }).then(function(playlists){
      res.render("playlists", {playlists: playlists});
    });
});

// POST - Add new playlist
app.post('/playlists', isLoggedIn, function(req,res) {
  console.log(req.body);

  console.log("IS ARRAY?", Array.isArray(req.body.trackLink), req.body.trackLink);
  
  if (!Array.isArray(req.body.trackLink)) {
    req.body.trackLink = [req.body.trackLink];
    req.body.name = [req.body.name];
    req.body.artist = [req.body.artist];
    req.body.artistLink = [req.body.artistLink];
    req.body.album = [req.body.album];
    req.body.albumLink = [req.body.albumLink];
    req.body.cover = [req.body.cover];
  }

  var tracksAddedToPlaylist = 0;
  var totalTracks = req.body.trackLink.length;

  db.playlists.findOrCreate({
    where: {name: req.body.playlistname},
    defaults: {
      cover: req.body.cover[0],
      userId: req.user.id
    }
  }).spread(function(playlists, created) {
    for (var i = 0; i < totalTracks; i++) {
      db.tracks.findOrCreate({
        where: { trackLink: req.body.trackLink[i] },
        defaults: { 
          name: req.body.name[i],
          artist: req.body.artist[i],
          album: req.body.album[i],
          cover: req.body.cover[i],
          playlistId: playlists.id,
          artistLink: req.body.artistLink[i],
          albumLink: req.body.albumLink[i] 
        }
      }).spread(function(track, created) {
        console.log("ADD TRACK")
        playlists.addTrack(track).then(function(playlists) {
          tracksAddedToPlaylist++;
          if (tracksAddedToPlaylist === totalTracks) {
            res.redirect('/playlists/' + playlists.id);
          }
        });

        console.log("ADD TRACKS")
        playlists.addTracks(track).then(function(playlists) {
          tracksAddedToPlaylist++;
          if (tracksAddedToPlaylist === totalTracks) {
            res.redirect('/playlists/' + playlists.id);
          }
        });
      });
    }
  });
});

// GET - Show playlist details
app.get('/playlists/:id', function(req, res) {
  db.playlists.find({
    where: { id: req.params.id },
    include: [db.tracks]
  })
  .then(function(playlists) {
    res.render('playlistShow', {playlists: playlists});
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

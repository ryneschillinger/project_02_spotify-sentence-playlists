// REQUIREMENTS
var express = require('express');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');

// APP VARIABLES
var db = require('./models'); 
var app = express();

// SET/USE STATEMENTS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static('public'));
app.use(express.static('files'))


// ROUTES

app.get('/', function(req, res) {
	res.render('index');
});


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
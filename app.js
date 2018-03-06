var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var routes = require('./routes');
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');

//home route
app.get('/',routes.home);

//for single movie
app.get('/starwars_episode', routes.single_movie);

//if the page doesnot exist
app.get('*', routes.notfound);

app.listen(3000, function(){
    console.log("The server started at localhost:3000");
});


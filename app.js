var express = require('express');
var app = express();
var http = require('http');
var request = require('request');

var options = {
    url: 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movies',
    method: 'GET',
    headers: {
        'x-access-token':'sjd1HfkjU83ksdsm3802k'
    }
}

app.get('/', function(req, res){
    request(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var movies = JSON.parse(body);
            console.log(movies);
           res.send(movies);
          }
    });
});

app.get('*', function(req, res){
    res.send("Error: page not found");
})

app.listen(3000, function(){
    console.log("The server started at localhost:3000");
});


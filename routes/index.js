var request = require('request');
var url = require('url');


var movies = [];

var options = {
    url: 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movies',
    method: 'GET',
    headers: {
        'x-access-token':'sjd1HfkjU83ksdsm3802k'
    }
}


//home route
exports.home =  function(req, res){
    request(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            movies = JSON.parse(body);
           res.render('index', {
               title: "Star Wars Movies",
               movies: movies
           });
          }
    });
};

//for single episode
exports.single_movie = function(req, res){
    
    var movie_title = req.query.movie_title;
    var movie = '';
    var movieid = '';

    for(var i=0; i< movies.Movies.length; i++) {
        if((movie_title) == (movies.Movies[i].Title)){
            movie = movies.Movies[i];
            movieid = movies.Movies[i].ID;
            break; 
        }
        else {
            res.send("Error page not found");
        }
    }
    
    console.log("Movie id is " +movieid);

    res.render('movie_single', {
        movies: movies,
        movie_title: movie_title,
        movie: movie
    })

};

//if the page doesnot exist
exports.notfound =  function(req, res){
    res.send("Error: page not found");
};

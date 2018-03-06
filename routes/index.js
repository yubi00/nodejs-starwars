var request = require('request');
var url = require('url');


var movies = [];
var single_movie = [];

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
    var price_cw = ''; 

    for(var i=0; i< movies.Movies.length; i++) {
        if((movie_title) == (movies.Movies[i].Title)){
            movie = movies.Movies[i];
            movieid = movies.Movies[i].ID;
            break; 
        }
       
    }
    
    console.log("Movie id is " +movieid);

    //make a http request to api based on specific id 
    options.url = 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movie/'+movieid ;
    
     request(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            single_movie =   JSON.parse(body);   
            console.log(single_movie.Price);
            res.render('movie_single', {
                movies: movies,
                movie_title: movie_title,
                movie: movie,
                single_movie: single_movie
            })     
          }
    }); 

};

//if the page doesnot exist
exports.notfound =  function(req, res){
    res.send("Error: page not found");
};

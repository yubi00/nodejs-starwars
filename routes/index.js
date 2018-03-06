var request = require('request');

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
    var episode_number = req.params.episode_number;
    res.send("This is the page for episode "+episode_number);
};

//if the page doesnot exist
exports.notfound =  function(req, res){
    res.send("Error: page not found");
};

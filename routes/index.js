var url = require('url');
var axios = require('axios');

var movies_fw = [];
var movies_cw = [];
var single_movie = [];


var options_fw = {
    url: 'http://webjetapitest.azurewebsites.net/api/filmworld/movies',
    method: 'GET',
    headers: {
        'x-access-token':'sjd1HfkjU83ksdsm3802k'
    }
}

var options_cw = {
    url: 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movies',
    method: 'GET',
    headers: {
        'x-access-token':'sjd1HfkjU83ksdsm3802k'
    }
}


//home route
exports.home =  async (req, res) => {
    try {
        let fw_response = await axios(options_fw);
        let cw_response = await axios(options_cw);
        movies_fw = fw_response.data;
        movies_cw = cw_response.data; 
        res.render('index', {
            title: "Star Wars Movies",
            movies_fw: movies_fw,
            movies_cw: movies_cw
        });
    }
    catch(e) {
        console.log("Error: "+e);
    }
          
};

//for single episode
exports.single_movie = async (req, res) => {
    
    movie_title = req.query.movie_title;
    var fw_movieid = '';
    var cw_movieid = '';
    var price_fw = 0; 
    var price_cw = 0;
    var options = '';

    if(req.query.api.includes('fw')) {
        fw_movieid = getMovieID(movie_title, movies_fw);
        options_fw.url = 'http://webjetapitest.azurewebsites.net/api/filmworld/movie/'+fw_movieid ;
        options = options_fw;

    }
    else 
    {
        cw_movieid = getMovieID(movie_title, movies_cw);
        options_fw.url = 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movie/'+cw_movieid ;
        options = options_fw
    }

    let single_movie_response = await axios(options);
    single_movie = single_movie_response.data;
    
    res.render('movie_single', {
        movie_title: movie_title,
        single_movie: single_movie
    }) 

};
 

//if the page doesnot exist
exports.notfound =  function(req, res){
    res.send("Error: page not found");
};

function getMovieID(movie_title, movies_api) {
    var movie = '';
    var movieid = '';
    for(var i=0; i< movies_api.Movies.length; i++) {
        if((movie_title) == (movies_api.Movies[i].Title)){
            movie =movies_api.Movies[i];
            movieid = movies_api.Movies[i].ID;
            return movieid;
        }
       
    }
}

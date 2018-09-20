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

let getPrice = (id) => {


    let world = "";


    if(id.substr(0,2) === "fw"){
        world = "filmworld"
    }
    else{
        world = "cinemaworld"
    }

    return axios({
        url:`http://webjetapitest.azurewebsites.net/api/${world}world/movie/${id}`,
        method:"GET",
        headers:{
            "x-access-token":"sjd1HfkjU83ksdsm3802k"
        }
    }).then((res) => {
        return parseFloat(res.data.Price);
    })
}

getPrice("fw0076759").then(price => {
    console.log(price)
})



let store = {
    cinemaworld:[],
    filmworld:[]
};

let prices = {
    cinemaworld:{},
    filmworld:{}
};
let worlds = [
axios(options_fw).then(res => {
    store.filmworld = res.data.Movies
}),

axios(options_cw).then(res => {
    store.cinemaworld = res.data.Movies
})];


Promise.all(worlds).then(() => {
    console.log("got store");
}).then(() => {
    console.log(store);
})







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
    
    try {
        movie_title = req.query.movie_title;
        var fw_movieid = '';
        var cw_movieid = '';
        var price_fw = 0; 
        var price_cw = 0;
        var options = '';
    
        fw_movieid = getMovieID(movie_title, movies_fw);
        cw_movieid = getMovieID(movie_title, movies_cw);
        options_fw.url = 'http://webjetapitest.azurewebsites.net/api/filmworld/movie/'+fw_movieid ;
        options_cw.url = 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movie/'+cw_movieid ;
    
        if(req.query.api.includes('fw')) {
            options = options_fw;
    
        }
        else 
        {  
            options = options_cw
        }
    
        let single_movie_response = await axios(options);
        single_movie = single_movie_response.data;
        
        res.render('movie_single', {
            movie_title: movie_title,
            single_movie: single_movie
        }) 
    
        var prices = [];
        prices = await comparePrices(options_fw, options_cw)
        price_fw = prices[0];
        console.log("film world price: "+price_fw);
        price_cw = prices[1];
        console.log("cinema world price: "+price_cw);
    
        if(price_fw < price_cw) {
            console.log("The price of movie in the filmworld store is cheaper ");
        }
        else
        {
            console.log("The price of the movie in the cinemaworld store is cheaper");
        }
    }
    catch(error)
    {
        console.log("error displaying: "+error);
    }
   
};
 

//if the page doesnot exist
exports.notfound =  function(req, res){
    res.send("Error: page not found");
};

function getMovieID(movie_title, movies_api) {
    var movieid = '';
    for(var i=0; i< movies_api.Movies.length; i++) {
        if((movie_title) == (movies_api.Movies[i].Title)){
            movieid = movies_api.Movies[i].ID;
            return movieid;
        }
        
    }
}

async function comparePrices(api1, api2) {
    try {
        var price_api1 = 0;
        var price_api2 = 0;

        let response_api1 = await axios(api1);
        let response_api2 = await axios(api2);

        price_api1 = response_api1.data.Price;
        price_api2 = response_api2.data.Price;

        return [price_api1, price_api2];
    }
    catch(error)
    {
        console.log("Error comparing prices: "+error);
    }

}

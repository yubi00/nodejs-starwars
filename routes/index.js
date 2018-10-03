var axios = require('axios');
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

let getPrice = async (id) => {


    let world = "";


    if(id.substr(0,2) === "fw"){
        world = "filmworld"
    }
    else{
        world = "cinemaworld"
    }

    let response = await axios({
        url:`http://webjetapitest.azurewebsites.net/api/${world}/movie/${id}`,
        method:"GET",
        headers:{
            "x-access-token":"sjd1HfkjU83ksdsm3802k"
        }
    })

    let price =  parseFloat(response.data.Price);
    return price;
}


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
exports.home =  function (req, res) {
    try {
        
        let test_fw = store.filmworld;
        let test_cw = store.cinemaworld;
        let test_concat = test_fw.concat(test_cw);
    
        let uniq_movies = removeDuplicity(test_concat);
        
        res.render('index', {
            title: "Star Wars Movies",
            movies: uniq_movies
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

        if(isExist(movie_title, store.filmworld) === true && isExist(movie_title, store.cinemaworld) === true){
            fw_movieid = getMovieID(movie_title, store.filmworld);
            cw_movieid = getMovieID(movie_title, store.cinemaworld);

            options_fw.url = 'http://webjetapitest.azurewebsites.net/api/filmworld/movie/'+fw_movieid ;
            options_cw.url = 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movie/'+cw_movieid ;
    
            price_fw = await getPrice(fw_movieid);
            price_cw = await getPrice(cw_movieid);
            console.log("The filworld price: "+price_fw);
            console.log("The cinemaworld price: "+price_cw);
            if(price_fw < price_cw) {
                options = options_fw;
        
            }
            else 
            {  
                options = options_cw
            }
        }
        else if(isExist(movie_title, store.filmworld) === true){
            fw_movieid = getMovieID(movie_title, store.filmworld);
            options_fw.url = 'http://webjetapitest.azurewebsites.net/api/filmworld/movie/'+fw_movieid ;
            options = options_fw;

        }
        else 
        {
            cw_movieid = getMovieID(movie_title, store.cinemaworld);
            options_cw.url = 'http://webjetapitest.azurewebsites.net/api/cinemaworld/movie/'+cw_movieid ;
            options = options_cw;
        }
    
        let single_movie_response = await axios(options);
        single_movie = single_movie_response.data;
        
        res.render('movie_single', {
            single_movie: single_movie
        }) 
    
        
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
    for(var i=0; i< movies_api.length; i++) {
        if((movie_title) === (movies_api[i].Title)){
            movieid = movies_api[i].ID;
            return movieid;
        }
        
    }
}


function removeDuplicity(datas){
    return datas.filter((item, index,arr)=>{
    const c = arr.map(item=> item.Title);
    return  index === c.indexOf(item.Title)
  })
}

function isExist(movie_title, movies_api) {
    for(var i=0; i< movies_api.length; i++) {
        if((movie_title) === (movies_api[i].Title)){
           return true;
        }
        
    }
    return false;
}
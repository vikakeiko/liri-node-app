const axios = require('axios');
const moment = require('moment');
require("dotenv").config();
const keys = require("./keys.js");
// const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const searchTerm = process.argv[3];

switch (command) {
    case "concert-this":
        console.log('You searched ' + searchTerm);
        getConcerts(searchTerm);
        break;
    case "movie-this":
        console.log('You searched ' + searchTerm);
        getMovies(searchTerm);
        break;
    case "spotify-this-song":
        console.log('You searched ' + searchTerm);
        // getSpotify(searchTerm)
        break;
    default:
        console.log('something went wrong?');
}

function getConcerts(search) {
    const queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    axios
        .get(queryUrl)
        .then(function(response) {
            const arrayResults = response.data;
            console.log(arrayResults);
            // loop through results
            arrayResults.forEach(function (result) {
                // get name of venue date of event and location
                // es6 Destructuring
                let { name, city } = result.venue;
                let date = result.datetime;
                // format date
                // date.moment('DD/MM/YYYY', true).format();
                date = moment().format('MM/DD/YYYY');
                console.log(name, city, date);
            })
        })
        .catch(function (error) {
            if (error.response) {
            }
        })
}

function getMovies(movieName) {
    movieName = movieName || "Mr. Nobody";

        const queryUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${movieName}`;
        axios
        .get(queryUrl)
        .then(function (response) {
            console.log(response.data);
            // pulling those data from response.data
            const {Year, Title, imdbRating, Language, Country, Plot, Actors, Ratings } = response.data;
            console.log(Year, Title, imdbRating, Language, Country, Plot, Actors, Ratings);
        })
}

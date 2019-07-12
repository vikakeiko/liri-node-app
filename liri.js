const axios = require('axios');
const moment = require('moment');
require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
var searchTerm = process.argv[3];

switch (command) {
    case "concert-this":
        getConcerts(searchTerm);
        break;
    case "movie-this":
        getMovies(searchTerm);
        break;
    case "spotify-this-song":
        if (!searchTerm) searchTerm = "The Sign (US Album) [Remastered]"
        getSpotify(searchTerm);
        break;
    case "do-what-it-says":
        var fs = require('fs');
        var data
        try {
            data = fs.readFileSync('random.txt', 'utf8');

        } catch (e) {
            console.log('Error:', e.stack);
        }


        getSpotify(data.toString().split(',')[1]);
        break;
    default:
        console.log('something went wrong?');
}


function getConcerts(search) {
    const queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    axios
        .get(queryUrl)
        .then(function (response) {
            const arrayResults = response.data;
            // console.log(arrayResults);
            if (arrayResults.length === 0) { console.log("Sorry, there is no events for this artist.") }
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
            // console.log(response.data);
            // pulling those data from response.data
            const { Year, Title, imdbRating, Language, Country, Plot, Actors, Ratings } = response.data;
            // console.log(Year, Title, imdbRating, Language, Country, Plot, Actors, Ratings);

            console.log(`
       The year of the movie: ${Year}
       Title: ${Title}
       imdbRating: ${imdbRating}
       Language: ${Language}
       Country: ${Country}
       Plot: ${Plot}
       Actor: ${Actors}
       Ratings: ${Ratings[0].Source}
       `);

        }).catch(function (err) {
            if (err) console.log(err);
        })

}

function getSpotify(song) {
    song = song
    spotify.search({ type: "track", query: song }).then(function (response) {
        if (response.tracks.items.length === 0) {
            let item = response.tracks.items[0];
            let songName = "Ace of Base";
            let album = "The Sign";
            let artist = "Ace of Base";
            let url = "https://open.spotify.com/artist/5ksRONqssB7BR161NTtJAm";
            console.log(`
       song: ${songName}
       album: ${album}
       artist: ${artist}
       url: ${url}`);

        } else {
            let item = response.tracks.items[0];
            let songName = item.name || "Ace of Base";
            let album = item.album.name || "The Sign";
            let artist = item.artists[0].name || " Ace of Base";
            let url = item.artists[0].external_urls.spotify || "https://open.spotify.com/artist/5ksRONqssB7BR161NTtJAm";


            console.log(`
       song: ${songName}
       album: ${album}
       artist: ${artist}
       url: ${url}`);
        }
    })
}

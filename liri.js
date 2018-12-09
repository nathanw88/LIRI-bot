require("dotenv").config();
var keys = require("./keys");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var axios = require("axios");
var rp = require("request-promise");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var bands = keys.bands;
var OMDB = keys.OMDB;

var userChoice;
var userSearch;

function toSearch(message) {
  inquirer
    .prompt([
      {
        type: "input",
        message: `${message}`,
        name: "toSearch"
      }
    ])
    .then(function(response) {
      console.log(message);
      console.log(response.toSearch);
      if (message === "Song to search!" && response.toSearch === "") {
        userSearch = "The Sign";
        checkingToDo();
      } else if (message === "Movie to search!" && response.toSearch === "") {
        userSearch = "Mr. Nobody";
        checkingToDo();
      } else {
        userSearch = response.toSearch;
        checkingToDo();
      }
    });
}
function toDo() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do",
        choices: [
          "concert-this",
          "movie-this",
          "spotify-this-song",
          "do-what-it-says",
          "quit"
        ],
        name: "choices"
      }
    ])
    .then(function(res) {
      userChoice = res.choices;
      checkingToDo();
    });
}

function userInput() {
  debugger;
  userChoice = process.argv[2];
  userSearch = process.argv.splice(3).join(" ");
  console.log(userSearch);
  if (userChoice === undefined) {
    toDo();
  } else {
    checkingToDo();
  }
}

function checkingToDo() {
  switch (userChoice) {
    case "concert-this":
      if (userSearch === "") {
        toSearch("Concert to search!");
      } else {
        bandSearch();
      }
      break;

    case "movie-this":
      if (userSearch === "") {
        toSearch("Movie to search!");
      } else {
        movieSearch();
      }
      break;

    case "spotify-this-song":
      if (userSearch === "") {
        toSearch("Song to search!");
      } else {
        songSearch();
      }
      break;

    case "do-what-it-says":
      break;

    default:
      console.log("enter the correct statement!");
      break;
  }
}
userInput();

function movieSearch() {
  axios
    .get(
      `http://www.omdbapi.com/?t=${userSearch}&y=&plot=short&apikey=${OMDB.id}`
    )
    .then(function(response) {
      console.log(`Title: ${response.data.Title}`);
      console.log(`Year: ${response.data.Year}`);
      console.log(`IMDB Rating: ${response.data.imdbRating}`);
      console.log(
        `${response.data.Ratings[1].Source}: ${response.data.Ratings[1].Value}`
      );
      console.log(`Country: ${response.data.Country}`);
      console.log(`Language: ${response.data.Language}`);
      console.log(`Plot: ${response.data.Plot}`);
      console.log(`Actors: ${response.data.Actors}`);
    });
}

function bandSearch() {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${userSearch}/events?app_id=${
        bands.id
      }`
    )
    .then(function(response) {
      console.log(response.data);
      for (var i = 0; i < response.data.length; i++) {
        console.log(`Venue: ${response.data[i].venue.name}
          Location: ${response.data[i].venue.city}, ${
          response.data[i].venue.country
        }
          Time: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`);
      }
    });
}
function songSearch() {
  spotify
    .search({ type: "track", query: `${userSearch}` })
    .then(function(response) {
      for (var i = 0; i < response.tracks.items.length; i++) {
        console.log(`Artist: ${response.tracks.items[i].artists[0].name}`);
        console.log(`Title: ${response.tracks.items[i].name}`);
        console.log(
          `Link to Song: ${response.tracks.items[i].external_urls.spotify}`
        );
        console.log(`Album: ${response.tracks.items[i].album.name}`);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

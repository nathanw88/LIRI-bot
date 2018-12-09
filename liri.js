// setting up all the requires
require("dotenv").config();
var keys = require("./keys");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var axios = require("axios");
var fs = require("fs");
// setting api keys to variables to be used
var spotify = new Spotify(keys.spotify);
var bands = keys.bands;
var OMDB = keys.OMDB;
// two variables to be used for user input
var userChoice;
var userSearch;

// function to be called to grab what to search for
// parameter messages is passed depending on what api we are going to call
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
      if (message === "Song to search!" && response.toSearch === "") {
        userSearch = "The Sign";
        checkingToDo();
      } else if (message === "Movie to search!" && response.toSearch === "") {
        userSearch = "Mr. Nobody";
        checkingToDo();
      } else if (response.toSearch.toLowerCase === "back") {
        userChoice = undefined;
        toDo();
      } else {
        userSearch = response.toSearch;
        checkingToDo();
      }
    });
}
// function that takes user input on what api to call, to quit, or to read commands from random.txt
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

// first function to be called checks if there were any command line arguments passed in
function userInput() {
  debugger;
  userChoice = process.argv[2];
  userSearch = process.argv.splice(3).join(" ");

  if (userChoice === undefined) {
    toDo();
  } else {
    checkingToDo();
  }
}

//looks to see what API user choose and if they have decided what search parameter to pass it
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
      fs.readFile("./random.txt", "utf8", function(err, data) {
        var arr = data.split(",");
        userChoice = arr[0];
        userSearch = arr[1];
        checkingToDo();
      });

      break;

    case "quit":
      break;

    default:
      console.log("enter the correct statement!");
      break;
  }
}
userInput();

// function for searching OMDB
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
      fs.appendFile(
        "log.txt",
        JSON.stringify(`${userChoice} Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB Rating: ${response.data.imdbRating}
        ${response.data.Ratings[1].Source}: ${response.data.Ratings[1].Value}
        Country: ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}`),
        err => {
          if (err) throw err;
        }
      );
      userSearch = "";
      userChoice = undefined;
      toDo();
    });
}

//Function to search bands in town
function bandSearch() {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${userSearch}/events?app_id=${
        bands.id
      }`
    )
    .then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log(`Venue: ${response.data[i].venue.name}
          Location: ${response.data[i].venue.city}, ${
          response.data[i].venue.country
        }
          Time: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`);
        fs.appendFile(
          "log.txt",
          JSON.stringify(`${userChoice} ${userSearch} Venue: ${
            response.data[i].venue.name
          }
        Location: ${response.data[i].venue.city}, ${
            response.data[i].venue.country
          }
        Time: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`),
          err => {
            if (err) throw err;
          }
        );
      }
      userSearch = "";
      userChoice = undefined;
      toDo();
    });
}

//function to search spotify
function songSearch() {
  spotify
    .search({ type: "track", query: `${userSearch}` })
    .then(function(response) {
      var matches = 0;
      for (var i = 0; i < response.tracks.items.length; i++) {
        if (
          response.tracks.items[i].name.toLowerCase() ===
          userSearch.toLowerCase()
        ) {
          matches++;
          console.log(`Artist: ${response.tracks.items[i].artists[0].name}`);
          console.log(`Title: ${response.tracks.items[i].name}`);
          console.log(
            `Link to Song: ${response.tracks.items[i].external_urls.spotify}`
          );
          console.log(`Album: ${response.tracks.items[i].album.name}`);
          fs.appendFile(
            "log.txt",
            JSON.stringify(`${userChoice} ${userSearch} Artist: ${
              response.tracks.items[i].artists[0].name
            }
            Title: ${response.tracks.items[i].name}
            Link to Song: ${
              response.tracks.items[i].external_urls.spotify
            } Album: ${response.tracks.items[i].album.name}`),
            err => {
              if (err) throw err;
            }
          );
        }
      }
      if (matches === 0) {
        for (var i = 0; i < response.tracks.items.length; i++) {
          matches++;
          console.log(`Artist: ${response.tracks.items[i].artists[0].name}`);
          console.log(`Title: ${response.tracks.items[i].name}`);
          console.log(
            `Link to Song: ${response.tracks.items[i].external_urls.spotify}`
          );
          console.log(`Album: ${response.tracks.items[i].album.name}`);
        }
      }
      userSearch = "";
      userChoice = undefined;
      toDo();
    })
    .catch(function(err) {
      console.log(err);
    });
}

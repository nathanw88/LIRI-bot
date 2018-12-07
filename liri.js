require("dotenv").config();
var keys = require("./keys");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
var axios = require("axios");

var spotify = new Spotify(keys.spotify);
var bands = keys.bands;
var OMDB = keys.OMDB;
console.log(bands.id);

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
      userSearch = response.toSearch;
      checkingToDo();
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
      console.log(response.data);
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
    });
}

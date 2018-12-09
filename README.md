# LiriBot

takes in arguments to search spotify, bands in town, or OMDB. can use input from command line to start the search if none is given it will prompt user for needed info

## Getting Started

after cloning this down you will need to enter the command npm i in the command line while in the directiory to get all the required node packages, you will need a .env file with the requierd keys. in this format

```
# Spotify API keys

SPOTIFY_ID =  Your-spotify-key
SPOTIFY_SECRET =	Your-spotify-secret

# Bands in town API keys

bands_API = Your-bands-key

# OMDB API keys

OMDB_API = Your-OMDB-key
```

## Screenshots

![starting with no arguments!](./screenshots/start-no-arguments.png?raw=true "Starting without an argument")

![concert search](./screenshots/concert-search.png?raw=true "Upon selecting concert-this")

![concert results](./screenshots/concert-results.png?raw=true "The results returned from concert this")

![movie & and spotify results](./screenshots/capture.png?raw=true "Results from movie & spotify")

![random.txt results](./screenshots/do-what-it-says?raw=true "Results from arguments in random.txt")

![command line arguments](./screenshots/comand-line-arguments.png?raw=true "Passing in command line arguments")

console.log("this is loaded");

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
  id: process.env.bands_API
};

exports.OMDB = {
  id: process.env.OMDB_API
};

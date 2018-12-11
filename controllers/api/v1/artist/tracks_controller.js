var pry = require('pryjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
require("isomorphic-fetch")

exports.show = function(request, response) {
  let search = request.params.artist_name;

  let tracksJson = [];
  fetch(`http://api.musixmatch.com/ws/1.1/track.search?q_artist=${search}&page_size=100&page=1&s_track_rating=desc&apikey=${process.env.MUSIXMATCH_API_KEY}`)
    .then(response => response.json())
    .then(tracks => {
      const tracksArray = tracks.message.body.track_list;
      for (let track of tracksArray) {
        let name        = track.track.track_name;
        let genre       = "Misc.";
        if (track.track.primary_genres.music_genre_list[0]) {
          genre = track.track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
        }
        let artist_name = track.track.artist_name;
        let song_rating = track.track.track_rating;
        tracksJson.push({name: name, genre: genre, artist_name: artist_name, song_rating: song_rating})
      }
      response.status(200).json(tracksJson)
    })
    .catch((error) => console.error({ error }))
}

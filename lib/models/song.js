const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

exports.all = function(request, response) {
  database('songs')
  .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])
  .then((songs) => {
    response.status(200).json(songs);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}

exports.find = function(request, response) {
  database('songs')
  .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])
  .where("id", request.params.id)
  .then((songs) => {
    response.status(200).json(songs);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}

exports.create = (song) => database('songs')
  .insert(song, ['id', 'name', 'artist_name', 'genre', 'song_rating'])

exports.update = (song, id) => database('songs')
  .select('id')
  .where("id", id)
  .update(song)

exports.withPlaylistId = () => database("songs")
  .select(['songs.id', 'name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'songs.id', '=', 'playlist_songs.song_id')

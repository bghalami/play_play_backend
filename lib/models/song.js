pry = require('pryjs')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

exports.all = function(request, response) {
  return database('songs')
  .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])
}

exports.find = function (request, response) {
  return database('songs')
  .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])
  .where("id", request.params.id)
}

exports.create = function(request, response) {
  const song = request.body

  return database('songs')
  .insert(song, ['id', 'name', 'artist_name', 'genre', 'song_rating'])
}

exports.update = function(request, response) {
  const song = request.body;
  const songId = request.params.id;
  let updatedSong

  database('songs')
  .select('id')
  .where("id", songId)
  .update(song)
  .then(() => {
    database('songs')
    .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])
    .where("id", request.params.id)
    .then((song) => {
      response.status(200).json({ songs: song[0] });
    })
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}

exports.withPlaylistId = () => database("songs")
  .select(['songs.id', 'name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'songs.id', '=', 'playlist_songs.song_id')

exports.delete = function(request, response) {
  const songId = request.params.id;

  database('playlist_songs')
    .where("song_id", songId)
    .del()
    .catch((error) => {
      response.status(404).json({ error });
    })

  database('songs')
    .where("id", request.params.id)
    .del()
    .then((deletedSong) => {
      response.status(204).json({ "message": "Success" });
    })
    .catch((error) => {
      response.status(404).json({ error });
    })
}
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
  const songId = request.params.id;
  const song = request.body;

  return database('songs')
  .select('id')
  .where("id", songId)
  .update(song)
}

exports.withPlaylistId = () => database("songs")
  .select(['songs.id', 'name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'songs.id', '=', 'playlist_songs.song_id')

exports.getPlaylists = function(request, response) {
  const songId = request.params.id;

  return database('playlist_songs')
  .where("song_id", songId)
}
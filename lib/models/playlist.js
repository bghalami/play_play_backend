const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

exports.all = () => database('playlists')
  .select(['playlists.id', 'playlists.name'])

exports.find = (request, response) => database('playlists')
  .select(['playlists.id', 'playlists.name'])
  .where('playlists.id', request.params.playlist_id)

exports.songs = () => database('playlists')
  .select(['playlists.id', 'playlists.name', 'songs.id', 'songs.name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'playlists.id', '=', 'playlist_songs.playlist_id')
  .join("songs", 'playlist_songs.song_id', '=', 'songs.id')


exports.playlistSongs = function(request, response) {
  const playlist = request.params.playlist_id
  const song = request.params.id

  return database('playlist_songs')
  .where({ song_id: song, playlist_id: playlist })
}

exports.addSong = function(request, response) {
  const playlist = request.params.playlist_id
  const song = request.params.id
  const playlistSong = { song_id: song, playlist_id: playlist }

  return database('playlist_songs')
    .insert(playlistSong, ['song_id', 'playlist_id'])
}

exports.create = function(request, response) {
  const playlist = request.body

  return database('playlists')
  .insert(playlist, 'name')
}

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

exports.all = () => database('playlists')
  .select(['playlists.id', 'playlists.name'])

exports.find = (id) => database('playlists')
  .select(['playlists.id', 'playlists.name'])
  .where('playlists.id', id)

exports.songs = () => database('playlists')
  .select(['playlists.id', 'playlists.name', 'songs.id', 'songs.name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'playlists.id', '=', 'playlist_songs.playlist_id')
  .join("songs", 'playlist_songs.song_id', '=', 'songs.id')



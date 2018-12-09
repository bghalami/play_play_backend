const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('songs')
  .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])

const find = (id) => database('songs')
  .select(['id', 'name', 'artist_name', 'genre', 'song_rating'])
  .where("id", id)

const create = (song) => database('songs')
  .insert(song, ['id', 'name', 'artist_name', 'genre', 'song_rating'])

const update = (song, id) => database('songs')
  .select('id')
  .where("id", id)
  .update(song)

const withPlaylistId = () => database("songs")
  .select(['songs.id', 'name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'songs.id', '=', 'playlist_songs.song_id')

module.exports = {
  all, find, create, update, withPlaylistId
}
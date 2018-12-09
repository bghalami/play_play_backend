const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlists')
  .select(['playlists.id', 'playlists.name'])

const find = (id) => database('playlists')
  .select(['playlists.id', 'playlists.name'])
  .where('playlists.id', id)

module.exports = {
  all, find
}
const Song = require('../../../lib/models/song');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

exports.index = function(request, response) {
  Song.all()
  .then((songs) => {
      response.status(200).json(songs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
  }


exports.show = function(request, response) {
  Song.find(request, response)
  .then((songs) => {
    response.status(200).json(songs);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}
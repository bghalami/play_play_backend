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

exports.create = function(request, response) {
  const song = request.body
  const requiredParameters = ['name', 'artist_name', 'genre', 'song_rating']
  for (let parameter of requiredParameters) {
    if (!song[parameter]) {
      return response
        .status(400)
        .send({ error: `Missing "${parameter}"` })
    } else if (song['song_rating'] > 100 || song['song_rating'] < 1) {
      return response
        .status(400)
        .send({ error: 'Song Rating must be between 1-100' })
    }
  }

  Song.create(request, response)
  .then((song) => {
    response.status(200).json({ "songs": song[0] });
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}
var pry = require('pryjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
require("isomorphic-fetch")

exports.search = function(request, response) {
  const search = request.body.name

  fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${search}&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=10`)
    .then(response => response.json())
    .then(artists => {
      let searchJson = [];
      const artistArray = artists.results.artistmatches.artist;
      for (let artist of artistArray) {
        searchJson.push({name: artist.name, image_url: artist.image[4]["#text"]})
      }
      response.status(200).json(searchJson)
    })
    .catch((error) => console.error({ error }))
}

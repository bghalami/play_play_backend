var pry = require('pryjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
require("isomorphic-fetch")

exports.show = function(request, response) {
  let search = request.body.name;
  search = encodeURIComponent(search.trim());

  fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${search}&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=6`)
    .then(response => response.json())
    .then(artists => {
      let albumJson = [];
      const albumArray = artists.topalbums.album;
      for (let album of albumArray) {
        albumJson.push({name: album.name, image_url: album.image[3]["#text"]})
      }
      response.status(200).json({albums: albumJson, songs: songJson})
    })
    .catch((error) => console.error({ error }))
}

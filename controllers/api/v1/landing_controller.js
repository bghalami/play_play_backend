var pry = require('pryjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
require("isomorphic-fetch")

exports.index = function(request, response) {
  fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=100`)
    .then(response => response.json())
    .then(artists => {
      let landingArray = [];
      let landingJson  = [];
      const artistArray = artists.artists.artist;
      for (let artist of artistArray) {
        landingArray.push({name: artist.name, image_url: artist.image[4]["#text"]})
      }
      for (i = 0; i < 6; i++) {
        let randomArtist = landingArray[Math.floor(Math.random()*landingArray.length)];
        landingJson.push(randomArtist);
        landingArray.splice(randomArtist, 1)
      }
      response.status(200).json(landingJson)
    })
    .catch((error) => console.error({ error }))
}

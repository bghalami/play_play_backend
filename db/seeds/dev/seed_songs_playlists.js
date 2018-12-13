var pry = require('pryjs')

exports.seed = function (knex, Promise) {
  return knex('playlist_songs').del()
    .then(() => knex('playlists').del())
    .then(() => knex('songs').del())
    .then(() => {
      return Promise.all([
        knex('songs').insert({ id: 1, name: 'Bicycle', artist_name: 'Queen', genre: 'Rock', song_rating: 85, favorite: false }, 'id')
          .then(song1 => {
            return knex('songs').insert({ id: 2, name: 'We Will Rock You', artist_name: 'Queen', genre: 'Rock', song_rating: 95, favorite: true }, 'id')
            .then(song2 => {
              return knex('playlists').insert({ id: 1, name: 'Rock Songs'}, 'id')
              .then(playlist1 => {
                return knex('playlists').insert({ id: 2, name: 'Swan Songs'}, 'id')
                .then(playlist2 => {
                  return knex('playlist_songs').insert({song_id: song1[0], playlist_id: playlist1[0]})
                  .then(() => {
                    return knex('playlist_songs').insert({song_id: song1[0], playlist_id: playlist2[0]})
                    .then(() => {
                      return knex('playlist_songs').insert({song_id: song2[0], playlist_id: playlist2[0]})
                    })
                  })
                })
              })
            })
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

pry = require('pryjs')

const SongsController    = require('./controllers/api/v1/songs_controller')
const PlaylistController = require('./controllers/api/v1/playlists_controller')
const SearchController = require('./controllers/api/v1/search_controller')
const Song       = require('./lib/models/song');
const Playlist   = require('./lib/models/playlist');
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

const environment   = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database      = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play-play';

app.get("/", (request, response) => {
  response.send("yo")
});

app.get('/api/v1/favorites', SongsController.index);

app.get('/api/v1/songs/:id', SongsController.show);

app.post('/api/v1/songs', SongsController.create);

app.patch('/api/v1/songs/:id', SongsController.update);

app.delete('/api/v1/songs/:id', SongsController.delete);

app.get('/api/v1/playlists', PlaylistController.index);

app.get('/api/v1/playlists/:playlist_id/songs', PlaylistController.show);

app.post('/api/v1/playlists/:playlist_id/songs/:id', PlaylistController.addSong);

app.delete('/api/v1/playlists/:playlist_id/songs/:id', PlaylistController.deleteSong);

app.get('/api/v1/search', SearchController.search);



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;

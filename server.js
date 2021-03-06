pry = require('pryjs')

const SongsController    = require('./controllers/api/v1/songs_controller');
const PlaylistController = require('./controllers/api/v1/playlists_controller');
const SearchController   = require('./controllers/api/v1/search_controller');
const LandingController  = require('./controllers/api/v1/landing_controller');
const ArtistController   = require('./controllers/api/v1/artist_controller');
const TracksController   = require('./controllers/api/v1/artist/tracks_controller');
const express    = require('express');
const app        = express();
const cors       = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play-play';

app.get("/", (request, response) => {
  response.send({
    "GET songs": '/api/v1/favorites',
    "GET song": '/api/v1/songs/:id',
    "POST song": '/api/v1/songs',
    "PATCH song": '/api/v1/songs/:id',
    "DELETE song": '/api/v1/songs/:id',
    "GET playlists": '/api/v1/playlists',
    "POST playlist": '/api/v1/playlists',
    "GET playlist songs": '/api/v1/playlists/:playlist_id/songs',
    "POST playlist song": '/api/v1/playlists/:playlist_id/songs/:id',
    "DELETE playlist song": '/api/v1/playlists/:playlist_id/songs/:id'    
  })
});

app.get('/api/v1/favorites', SongsController.index);
app.get('/api/v1/songs/:id', SongsController.show);
app.post('/api/v1/songs', SongsController.create);
app.patch('/api/v1/songs/:id', SongsController.update);
app.delete('/api/v1/songs/:id', SongsController.delete);
app.get('/api/v1/playlists', PlaylistController.index);
app.post('/api/v1/playlists', PlaylistController.create);
app.get('/api/v1/playlists/:playlist_id/songs', PlaylistController.show);
app.post('/api/v1/playlists/:playlist_id/songs/:id', PlaylistController.addSong);
app.delete('/api/v1/playlists/:playlist_id/songs/:id', PlaylistController.deleteSong);

app.get('/api/v1/search/:artist_name', SearchController.search);
app.get('/api/v1/landing',LandingController.index);
app.get('/api/v1/artists/:artist_name',ArtistController.show);

app.get('/api/v1/artists/:artist_name/tracks',TracksController.show);


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;

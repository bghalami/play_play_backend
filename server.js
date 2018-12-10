pry = require('pryjs')

const SongsController = require('./controllers/api/v1/songs_controller')
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

app.patch('/api/v1/songs/:id', Song.update);

app.delete('/api/v1/songs/:id', Song.delete);

app.post('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
  const playlist      = request.params.playlist_id
  const song          = request.params.id
  const playlistSong = {song_id: song, playlist_id: playlist}

  let songName     = ""
  let playlistName = ""
  database('songs')
  .select('name')
  .where('id', song)
  .then(song => {
    songName = song[0].name
  })

  database('playlists')
  .select('name')
  .where('id', playlist)
  .then(playlist => {
    playlistName = playlist[0].name
  })

  database('playlist_songs')
  .insert(playlistSong, ['song_id', 'playlist_id'])
  .then(() => {
    response.status(201).json({"message": `Successfully added ${songName} to ${playlistName}`});
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
  const playlist      = request.params.playlist_id
  const song          = request.params.id

  let songName     = ""
  let playlistName = ""
  database('songs').select('name')
    .where('id', song)
    .then(song => {
      songName = song[0].name
    })

  database('playlists').select('name')
    .where('id', playlist)
    .then(playlist => {
      playlistName = playlist[0].name
    })

  let somthing = new Promise()

  database('playlist_songs')
    .where({song_id: song, playlist_id: playlist})
    .del()
    .then(() => {
      response.status(201).json({"message": `Successfully removed ${songName} from ${playlistName}`});
    })
    .catch((error) => {
      response.status(404).json({ error });
    })
});

app.get('/api/v1/playlists', (request, response) => {
  let playlists = []
  let songs = []

  Playlist.all()
  .then((a) => {
    playlists = a
  })

  Song.withPlaylistId()
  .then((a) => { songs = a })
  .then(() => {
    for(let playlist of playlists) {
      playlist.songs = songs.filter(song => (song.playlist_id == playlist.id))
      playlist.songs.forEach(song => delete song.playlist_id)
    }
  })
  .then(() => {response.status(200).json(playlists)})
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/playlists/:playlist_id/songs', (request, response) => {
  let playlistId = request.params.playlist_id
  let playlists = []
  let songs = []
  // refactoring db calls 
  /*
  let playlistSongs = []

  Playlist.songs()
  .then((a) => { playlistSongs = a })
  .then((playlistSongs) => {
    let playlists = []
    playlistSongs.filter(playlistSong => )
    for (let playlistSong of playlistSongs) {
      let playlist = {}
      playlist.id = 
      playlist.songs = songs.filter(song => (song.playlist_id == playlist.id))
      playlist.songs.forEach(song => delete song.playlist_id)
    }
  */

  Playlist.find(playlistId)
  .then((a) => {
    playlists = a
  })

  Song.withPlaylistId()
  .then((a) => { songs = a })
  .then(() => {
    for(let playlist of playlists) {
      playlist.songs = songs.filter(song => (song.playlist_id == playlist.id))
      playlist.songs.forEach(song => delete song.playlist_id)
    }
  })
  .then(() => {response.status(200).json(playlists)})
  .catch((error) => {
    response.status(500).json({ error });
  });
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;

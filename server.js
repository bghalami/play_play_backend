pry = require('pryjs')

const Song       = require('./lib/models/song');
const Playlist       = require('./lib/models/playlist');
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

app.get('/api/v1/favorites', (request, response) => {
  Song.all()
    .then((songs) => {
      response.status(200).json(songs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/songs/:id', (request, response) => {
  Song.find(request.params.id)
    .then((songs) => {
      response.status(200).json(songs);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/songs', (request, response) => {
  const song = request.body

  const requiredParameters = ['name', 'artist_name', 'genre', 'song_rating']
  for(let parameter of requiredParameters) {
    if (!song[parameter]) {
      return response
        .status(400)
        .send({error: `Missing "${parameter}"`})
    } else if (song['song_rating'] > 100 || song['song_rating'] < 1) {
      return response
        .status(400)
        .send({error: 'Song Rating must be between 1-100'})
    }
  }

  Song.create(song)
    .then((song) => {
      response.status(200).json({"songs": song[0]});
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/songs/:id', function (request, response) {
  const song   = request.body;
  const songId = request.params.id;

  Song.update(song, songId)
    .then(() => {
      Song.find(songId)
      .then((updatedSong) => {
      response.status(200).json({ songs: updatedSong[0] });
    })
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/songs/:id', function (request, response) {
  const songId = request.params.id;

  database('playlist_songs')
  .where("song_id", songId)
  .del()
  .catch((error) => {
    response.status(404).json({ error });
  })

  Song.find(songId)
  .del()
  .then((deletedSong) => {
    response.status(204).json({ "message": "Success" });
  })
  .catch((error) => {
    response.status(404).json({ error });
  })
});

app.post('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
  const playlist      = request.params.playlist_id
  const song          = request.params.id
  const playlistSong = {song_id: song, playlist_id: playlist}

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
  database('playlist_songs').insert(playlistSong, ['song_id', 'playlist_id'])
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

  database("songs")
  .select(['songs.id', 'name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'songs.id', '=', 'playlist_songs.song_id')
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
  database('playlists').select(['playlists.id', 'playlists.name'])
  .where('playlists.id', playlistId)
  .then((a) => {
    playlists = a
  })

  database("songs")
  .select(['songs.id', 'name', 'artist_name', 'genre', 'song_rating', 'playlist_songs.playlist_id'])
  .join("playlist_songs", 'songs.id', '=', 'playlist_songs.song_id')
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

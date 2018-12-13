var pry = require('pryjs')
const Playlist = require('../../../lib/models/playlist');
const Song = require('../../../lib/models/song');

exports.index = function(request, response) {
  let playlists = []
  let songs = []

  Promise.all([
    Playlist.all()
    .then((a) => {
      playlists = a
    }),

    Song.withPlaylistId()
    .then((a) => { songs = a })
    .then(() => {
      for (let playlist of playlists) {
        playlist.songs = songs.filter(song => (song.playlist_id == playlist.id))
        playlist.songs.forEach(song => delete song.playlist_id)
      }
    })
    .then(() => { response.status(200).json(playlists) })
    .catch((error) => {
      response.status(500).json({ error });
    })
  ]);
}

exports.show = function(request, response) {
  let playlists = []
  let songs = []

  Promise.all([

    Playlist.find(request, response)
    .then((a) => {
      playlists = a
    }),

    Song.withPlaylistId()
    .then((a) => { songs = a })
    .then(() => {
      for (let playlist of playlists) {
        playlist.songs = songs.filter(song => (song.playlist_id == playlist.id))
        playlist.songs.forEach(song => delete song.playlist_id)
      }
    })
    .then(() => { response.status(200).json(playlists) })
    .catch((error) => {
      response.status(500).json({ error });
    })
  ])
}

exports.deleteSong = function(request, response) {
  const playlist = request.params.playlist_id
  const song = request.params.id

  let songName = ""
  let playlistName = ""
  Promise.all([
    Song.find(request, response)
    .then(song => {
      songName = song[0].name
    }),

    Playlist.find(request, response)
    .then(playlist => {
      playlistName = playlist[0].name
    }),

    Playlist.playlistSongs(request, response)
    .del()
    .then(() => {
      response.status(201).json({ "message": `Successfully removed ${songName} from ${playlistName}` });
    })
    .catch((error) => {
      response.status(404).json({ error });
    })
  ])
}

exports.addSong = function(request, response) {
  let songName = ""
  let playlistName = ""

  Song.find(request, response)
  .then(song => {
    songName = song[0].name
  })

  Playlist.find(request, response)
  .then(playlist => {
    playlistName = playlist[0].name
  })

  Playlist.addSong(request, response)
  .then(() => {
    response.status(201).json({ "message": `Successfully added ${songName} to ${playlistName}` });
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
}

exports.create = function(request, response) {
  const playlist = request.body
  if (!playlist.name) {
    return response
      .status(400)
      .send({ error: `Missing "${parameter}"` })
  }
  Playlist.create(request, response)
  .then((playlist) => {
    response.status(200).json({ "playlists": playlist[0] }) ;
  })
  .catch((error) => {
    response.status(500).json({ error})
  });
}

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
  let playlistId = request.params.playlist_id
  let playlists = []
  let songs = []

  Promise.all([

    Playlist.find(playlistId)
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
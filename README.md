# Play Play Productions

#### Created By Ben Ghalami and Matt Peters

This is the back end API with the ability to favorite songs and add them to playlists.  It consumes the lastfm API to search artists and artist pictures, which then uses the MusixMatch API to search for tracks.

You can use the app in production on [Heroku](https://play-play-api.herokuapp.com/).

## Schema

![screen shot 2018-12-07 at 3 04 50 pm](https://user-images.githubusercontent.com/7269813/49945729-b8048700-feaa-11e8-8149-23cb720f37ec.png)

## Endpoints

```
{
"GET songs": "/api/v1/favorites",
"GET song": "/api/v1/songs/:id",
"POST song": "/api/v1/songs",
"PATCH song": "/api/v1/songs/:id",
"DELETE song": "/api/v1/songs/:id",
"GET playlists": "/api/v1/playlists",
"POST playlist": "/api/v1/playlists",
"GET playlist songs": "/api/v1/playlists/:playlist_id/songs",
"POST playlist song": "/api/v1/playlists/:playlist_id/songs/:id",
"DELETE playlist song": "/api/v1/playlists/:playlist_id/songs/:id"
}
```


## Contributing

If you would like to contribute, you can follow the steps in the next two sections to get running on your machine.

You will need to obtain API keys from [last.fm](https://www.last.fm/api) and [musixmatch](https://developer.musixmatch.com/) and add them to the project with dotenv.

## Initial Setup

1. Clone the repository and rename the repository to anything you'd like in one command:

  ```shell
  git clone git@github.com:bghalami/play_play_backend.git
  ```
2. Change into the new director directory.

3. Install the dependencies:

  ```shell
  npm install
  ```
  

## Running the Server Locally

To see your code in action locally, you need to fire up a development server. Use the command:

```shell
node server.js
```

Once the server is running, visit in your browser:

* `http://localhost:3000/` to run your application.


## Built With

* [JavaScript](https://www.javascript.com/)
* [jQuery](https://jquery.com/)
* [Express](https://expressjs.com/)
* [Mocha](https://mochajs.org/)
* [Chai](https://chaijs.com/)


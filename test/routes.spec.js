var pry = require('pryjs')

const chai     = require('chai');
const should   = chai.should();
const chaiHttp = require('chai-http');
const server   = require('../server');

const environment   = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database      = require('knex')(configuration);

chai.use(chaiHttp);

describe('Landing Page', () => {
  it("It lands", done => {
    chai.request(server)
      .get("/")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
    });
  });
});

describe('Favorites API', () => {
  before((done) => {
    database.migrate.latest()
      .then( () => done() )
      .catch(error => {
        throw error;
      })
  });

  beforeEach((done) => {
    database.seed.run()
      .then( () => done() )
      .catch(error => {
        throw error;
      });
  });

  it("returns our favorite songs", done => {
    chai.request(server)
      .get("/api/v1/favorites")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Bicycle');
        response.body[0].should.have.property('artist_name');
        response.body[0].artist_name.should.equal('Queen');
        response.body[0].should.have.property('genre');
        response.body[0].genre.should.equal('Rock');
        response.body[0].should.have.property('song_rating');
        done();
    });
  });
});

describe('Songs API', () => {
  before((done) => {
    database.migrate.latest()
      .then( () => done() )
      .catch(error => {
        throw error;
      })
  });

  beforeEach((done) => {
    database.seed.run()
      .then( (a) => done() )
      .catch(error => {
        throw error;
      });
  });


  it("song show route returns a song by id", done => {
    
    chai.request(server)
      .get(`/api/v1/songs/1`)
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.have.property('id');
        response.body[0].should.be.an('object');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Bicycle');
        response.body[0].should.have.property('artist_name');
        response.body[0].artist_name.should.equal('Queen');
        response.body[0].should.have.property('genre');
        response.body[0].genre.should.equal('Rock');
        response.body[0].should.have.property('song_rating');
        done();
      });
  });

  it("can create a song", done => {
    
    chai.request(server)
      .post(`/api/v1/songs`)
      .send( { 
        id: 3, 
        name: 'new song', 
        artist_name: 'old dogs', 
        genre: 'Rock', 
        song_rating: 44, 
        favorite: false }
      )
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('songs');
        response.body.songs.should.be.an('object');
        response.body.songs.should.have.property('name');
        response.body.songs.name.should.equal('new song');
        response.body.songs.should.have.property('artist_name');
        response.body.songs.artist_name.should.equal('old dogs');
        response.body.songs.should.have.property('genre');
        response.body.songs.genre.should.equal('Rock');
        response.body.songs.should.have.property('song_rating');
        response.body.songs.song_rating.should.equal(44);
        done();
      });
  });

  it("can update a song", done => {
    
    chai.request(server)
      .patch(`/api/v1/songs/1`)
      .send( { name: 'new name' }
      )
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('songs');
        response.body.songs.should.be.an('object');
        response.body.songs.should.have.property('name');
        response.body.songs.name.should.equal('new name');
        response.body.songs.should.have.property('artist_name');
        response.body.songs.artist_name.should.equal('Queen');
        response.body.songs.should.have.property('genre');
        response.body.songs.genre.should.equal('Rock');
        response.body.songs.should.have.property('song_rating');
        response.body.songs.song_rating.should.equal(85);
        done();
      });
  });
  
  it("can delete a song", done => {
    
    chai.request(server)
      .delete(`/api/v1/songs/1`)
      .end((err, response) => {
        response.should.have.status(204);
        done();
      });
  });
});

describe('Playlists API', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      })
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  it("returns playlists", done => {
    chai.request(server)
      .get("/api/v1/playlists")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Rock Songs');
        response.body[0].should.have.property('songs');
        response.body[0].songs.should.be.a('array');
        response.body[0].songs[0].should.have.property('artist_name');
        response.body[0].songs[0].should.have.equal('Queen');
        done();
      });
  });

  it("creates a playlist", done => {
    chai.request(server)
      .post("/api/v1/playlists")
      .send({ id: 3, name: 'old Songs' })
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('playlists');
        response.body.playlists.should.equal('old Songs');
        done();
      });
  });

  it("returns songs from a playlist", done => {
    chai.request(server)
      .get("/api/v1/playlists/1/songs")
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('songs');
        response.body[0].songs.should.be.an('array');
        response.body[0].songs[0].should.be.an('object');
        response.body[0].songs[0].have.property('name');
        done();
      });
  });

  it("adds a song to a playlist", done => {
    chai.request(server)
      .post("/api/v1/playlists/1/songs/2")
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.property('message');
        done();
      });
  });

  it("deletes a song from a playlist", done => {
    chai.request(server)
      .delete("/api/v1/playlists/1/songs/1")
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.property('message');
        done();
      });
  });
});


var pry = require('pryjs')
// eval(pry.it)

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


describe("My API routes", () => {


  after((done) => {

  });
});

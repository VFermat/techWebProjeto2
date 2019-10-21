const app = require('express')();
const parser = require('body-parser');
const util = require('util');
const axios = require('axios');
const mongo = require('mongodb');

const {MongoClient} = mongo;

const CONFIGS = {
  dbUrl: 'mongodb+srv://Henrer:Rocher@techweb-r9i58.mongodb.net/admin?retryWrites=true&w=majority',
  // dbUrl: 'mongodb://127.0.0.1:27017',
  dbName: 'movies',
  dbAuthName: 'TechWeb',
};

const uflixit = {
  baseUrl: 'https://uflixit.p.rapidapi.com',
  headers: {
    'content-type': 'application/octet-stream',
    'x-rapidapi-host': 'uflixit.p.rapidapi.com',
    'x-rapidapi-key': 'da0b039cadmsh777ad4452c07f9cp1b140ajsn2155a240275d',
  },
};

const theMovieDB = {
  searchByTitleURL: 'https://api.themoviedb.org/3/search/movie?api_key=e065aad1be38f0202d339b9fe5533ef9&query=',
  searchByID: 'https://api.themoviedb.org/3/movie/',
  apiKey: 'e065aad1be38f0202d339b9fe5533ef9',
};

app.use(parser.json());
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers',
      'X-Requested-With,content-type');

  next();
});

const client = new MongoClient(CONFIGS.dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true});

client.connect((err) => {
  if (err) {
    console.log(err);
  }

  const db = client.db(CONFIGS.dbName);

  /**
   *
   * @param {String} userId - Indicates the id of the user you want to authenticate
   * @param {String} token - Indicates the token of the user you want to authenticate
   * @return {Boolean} if the user is authenticated or not
   */
  async function authenticateUser(userId, token) {
    let tokenId;
    await client.db(CONFIGS.dbAuthName).collection('tokens')
        .findOne({token: token})
        .then((v) => {
          tokenId = v.userId;
        })
        .catch((e) => {
          tokenId = null;
        });
    return userId === tokenId;
  }

  app.route('/movies')
      .post(async (req, res, next) => {
        const category = 'movies';
        const type = req.body.type;

        let movies;
        await axios({
          'method': 'GET',
          'url': util.format('%s/%s/%s', uflixit.baseUrl, category, type),
          'headers': uflixit.headers,
        }).then((v) => {
          movies = v.data.result;
        }).catch((e) => {
          movies = null;
        });
        if (movies) {
          const payload = {
            type: type,
            movies: movies,
          };
          await db.collection(category).insertOne(payload).then((v) => {
            res.send({
              [category]: movies,
            });
          }).catch((e) => {
            res.status(400).send({
              message: e.message,
            });
          });
        } else {
          res.status(400).send({
            message: 'Deu Ruim Ze',
          });
        }
      })
      .get(async (req, res, next) => {
        const category = 'movie';
        const type = req.query.type;
        let dbMovies;
        await db.collection(category).find({type: type}).toArray().then((v) => {
          dbMovies = v;
          res.send({
            movies: dbMovies,
          });
        }).catch((e) => {
          res.status(400).send({
            message: e.message,
          });
        });
      });

  app.route('/movie/:movieId')
      .post(async (req, res, next) => {
        const category = 'movies';
        const type = req.body.type;
        let movie;

        await axios({
          'method': 'GET',
          'url': util.format('%s/%s/details/%s',
              uflixit.baseUrl,
              category,
              req.params.movieId),
          'headers': uflixit.headers,
        }).then((v) => {
          movie = v.data.result;
        }).catch((e) => {
          movie = null;
        });
        if (movie) {
          movie.imdbId = movie.imdb_id;
          movie.type = type;
          delete movie.imdb_id;
          await db.collection(category).insertOne(movie).then((v) => {
            movie.id = v.insertedId;
            res.send(movie);
          }).catch((e) => {
            res.status(400).send({
              message: e.message,
            });
          });
        } else {
          res.status(400).send({
            message: 'Deu Ruim Ze',
          });
        };
      })
      .get(async (req, res, next) => {
        const category = 'movie';
        const movieId = req.params.movieId;

        await db.collection(category).findOne({imdbId: movieId}).then((v) => {
          if (v) {
            const movie = v;
            movie.id = movie._id;
            delete movie._id;
            res.send(movie);
          } else {
            res.status(400).send({
              message: 'No movie with refered id',
            });
          }
        }).catch((e) => {
          res.status(400).send({
            message: e.message,
          });
        });
      })
      .patch(async (req, res, next) => {
        const category = 'movie';
        const movieId = req.params.movieId;

        await db.collection(category).updateOne({imdbId: movieId}, {
          $set: req.body,
        }).then((v) => {
          res.send(v);
        }).catch((e) => {
          res.status(400).send({
            message: e.message,
          });
        });
      });

  // GET movie by title
  app.route('/search').get(async (req, res, next) => {
    console.log('GET em /search:');

    const title = req.query.t;

    console.log('Movie title: ' + title);
    console.log('Fazendo request no TheMovieDB...');

    await axios.get(theMovieDB.searchByTitleURL + title)
        .then((v) => {
          console.log('Resposta:');

          console.log(v.data);

          res.send(v.data);
        })
        .catch((e) => {
          res.status(400).send({
            message: e.message,
          });
        });
  });

  // GET movie details by id
  app.route('/search/:movieId').get(async (req, res, next) => {
    console.log('GET em /search/:movieId');

    const movieId = req.params.movieId;
    console.log('Movie ID: ' + movieId);
    console.log(theMovieDB.searchByID + movieId + '?' + theMovieDB.apiKey);

    await axios.get(theMovieDB.searchByID + movieId + '?api_key=' + theMovieDB.apiKey)
        .then((v) =>{
          console.log('Resposta:');

          console.log(v.data);

          res.send(v.data);
        })
        .catch((e) =>{
          res.status(400).send({
            message: e.message,
          });
        });
  });
});

app.listen(8081);

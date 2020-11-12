const app = require('express')();
const parser = require('body-parser');
const util = require('util');
const axios = require('axios');
const mongo = require('mongodb');

const {MongoClient} = mongo;

const CONFIGS = {
  // dbUrl: 'mongodb+srv://Henrer:Rocher@techweb-r9i58.mongodb.net/admin?retryWrites=true&w=majority',
  dbUrl: 'mongodb://52.14.233.110:27017',
  dbName: 'movies'
};

const uflixit = {
  baseUrl: 'https://uflixit.p.rapidapi.com',
  headers: {
    'content-type': 'application/octet-stream',
    'x-rapidapi-host': 'uflixit.p.rapidapi.com',
    'x-rapidapi-key': 'da0b039cadmsh777ad4452c07f9cp1b140ajsn2155a240275d',
  },
};

const telesign = {
  baseUrl: 'https://telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com',
  headers: {
    'x-rapidapi-host': 'telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com',
    'x-rapidapi-key': 'da0b039cadmsh777ad4452c07f9cp1b140ajsn2155a240275d',
    'content-type': 'application/x-www-form-urlencoded',
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
  res.setHeader('Access-Control-Allow-Origin', '*');
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
        console.log('oi');
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

    const title = req.query.title;

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

  app.route('/comments/:movieId').get(async (req, res, next) => {
    const movieId = req.params.movieId;
    await db.collection('comments').find({
      movie: movieId,
    }).sort({date: -1}).toArray().then((v) => {
      res.send({
        comments: v,
      });
    }).catch((e) => {
      res.status(400).send({
        message: e.message,
      });
    });
  }).post(async (req, res, next) => {
    await db.collection('comments').insertOne(req.body).then((v) => {
      const comment = v;
      comment.id = comment._id;
      delete comment._id;
      res.send({
        comment: comment,
      });
    }).catch((e) => {
      res.status(400).send({
        message: e.message,
      });
    });
  });

  // USER Routes
  app.route('/user')
      .post(async (req, res, next) => {
        const data = req.body;

        const salt = crypto.randomBytes(16).toString('base64');
        const hash = crypto.createHash('sha256')
            .update(salt + data.password)
            .digest('base64');
        const user = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          salt: salt,
          password: hash,
          valid: false,
          movies: [],
        };

        const min = Math.ceil(1000);
        const max = Math.ceil(9999);
        const otp = Math.floor(Math.random() * (max - min)) + min;

        user.otp = otp;

        await db.collection('users').insertOne(user)
            .then((v) => {
              user.id = v.insertedId;
              delete user.otp;
              res.send(user);
            })
            .catch((err) => {
              res.status(400).send({
                message: err.message,
              });
            });

        await axios({
          'method': 'POST',
          'url': 'https://telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com/sms-verification-code',
          'headers': telesign.headers,
          'params': {
            'phoneNumber': user.phone,
            'verifyCode': otp,
            'appName': 'MovieMe',
          },
          'data': {

          },
        }).then((v) => {
          console.log(v);
        }).catch((e) => {
          console.log(e.response);
        });
      });

  app.route('/user/:userId')
      .get(async (req, res, next) => {
        const userId = req.params.userId;
        const auth = req.headers.authorization;
        const authenticated = await authenticateUser(auth, userId);

        if (authenticated) {
          let user;
          await db.collection('users').findOne({
            _id: new mongo.ObjectID(userId),
          }).then((v) => {
            user = v;
          }).catch((e) => {
            user = null;
          });

          if (user) {
            user.id = user._id;
            delete user._id;
            res.send(user);
          } else {
            res.status(400).send({
              message: 'User not found',
            });
          }
        } else {
          res.status(405).send({
            message: 'Unauthorized access',
          });
        }
      })
      .patch(async (req, res, next) => {
        const userId = req.params.userId;
        const auth = req.headers.authorization;
        const authenticated = await authenticateUser(auth, userId);

        if (authenticated) {
          await db.collection('users').updateOne({
            _id: new mongo.ObjectID(userId),
          }, {
            $set: req.body,
          }).then((v) => {
            res.send(v);
          }).catch((e) => {
            res.status(400).send({
              message: e.message,
            });
          });
        } else {
          res.status(405).send({
            message: 'Unauthorized access',
          });
        }
      });

  app.route('/sendOtp/:userId')
      .post(async (req, res, next) => {
        const userId = req.params.userId;

        await db.collection('users').findOne({
          _id: new mongo.ObjectID(userId),
        }).then(async (v) => {
          await axios({
            'method': 'POST',
            'url': telesign.baseUrl + '/sms-verification-code',
            'headers': telesign.headers,
            'data': {
              'phoneNumber': v.phone,
              'verifyCode': v.otp,
              'appName': 'MovieMe',
            },
          }).then((v) => {}).catch((e) => console.log(e.response));
          res.send({
            message: 'success',
          });
        }).catch((e) => {
          res.status(400).send({
            message: e.message,
          });
        });
      });

  // LOGIN route
  app.route('/login')
      .post(async (req, res, next) => {
        const data = req.body;
        let user;
        await db.collection('users').findOne({email: data.email})
            .then((v) => {
              user = v;
            })
            .catch((e) => {
              user = null;
            });

        if (user) {
          const inputPassword = crypto.createHash('sha256')
              .update(user.salt + data.password)
              .digest('base64');
          if (inputPassword === user.password) {
            user.id = user._id;
            delete user._id;
            const auth = crypto.randomBytes(64).toString('base64');
            const payload = {
              token: auth,
              userId: user.id,
            };
            await db.collection('tokens').insertOne(payload)
                .then((v) => {
                  user.token = auth;
                  res.send(user);
                })
                .catch((e) => {
                  res.status(400).send({
                    message: e,
                  });
                });
          } else {
            res.status(405).send({
              message: 'Unauthorized access',
            });
          }
        } else {
          res.status(400).send({
            message: 'No user found',
          });
        }
      });

  // Route to validate user!
  app.route('/validate/:userId')
      .post(async (req, res, next) => {
        const userId = req.params.userId;
        const otp = req.body.otp;
        let user = null;
        let error;
        await db.collection('users').findOne({
          _id: new mongo.ObjectID(userId),
        }).then((v) => {
          user = v;
        }).catch((e) => {
          error = e;
        });

        if (user) {
          if (otp == user.otp) {
            await db.collection('users').updateOne({
              _id: new mongo.ObjectID(userId),
            }, {
              $set: {
                valid: true,
              },
            }).then((v) => {
              res.send({
                message: 'User validated',
              });
            }).catch((e) => {
              res.status(400).send({
                message: e.message,
              });
            });
          } else {
            res.status(415).send({
              message: 'Invalid OTP',
            });
          }
        } else {
          res.status(400).send({
            message: error.message,
          });
        }
      });
});

app.listen(80);

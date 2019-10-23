const app = require('express')();
const parser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');
const mongo = require('mongodb');

const {MongoClient} = mongo;
const CONFIGS = {
  // dbUrl: 'mongodb+srv://Henrer:Rocher@techweb-r9i58.mongodb.net/admin?retryWrites=true&w=majority',
  dbUrl: 'mongodb://127.0.0.1:27017',
  dbName: 'techweb',
};

const telesign = {
  baseUrl: 'https://telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com',
  headers: {
    'x-rapidapi-host': 'telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com',
    'x-rapidapi-key': 'da0b039cadmsh777ad4452c07f9cp1b140ajsn2155a240275d',
    'content-type': 'application/x-www-form-urlencoded',
  },
};

app.use(parser.json());
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization');

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
   * Function responsible for user authentication.
   * @param {String} authorization
   * @param {String} userId (option)
   * @return {null | Object} Function returns either the user id or null.
   */
  async function authenticateUser(authorization, userId=null) {
    let response;
    await db.collection('tokens').findOne({token: authorization})
        .then((v) => {
          response = v.userId;
        })
        .catch((err) => {
          response = null;
        });
    if (userId) {
      return response == userId;
    } else {
      return response;
    }
  }

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
        }).then((v) => {
          axios({
            'method': 'POST',
            'url': telesign.baseUrl + '/sms-verification-code',
            'headers': telesign.headers,
            'data': {
              'phoneNumber': v.phone,
              'verifyCode': v.otp,
              'appName': 'MovieMe',
            },
          });
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

app.listen(8080);

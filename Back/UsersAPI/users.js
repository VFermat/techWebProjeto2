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

app.use(parser.json());
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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
   * @return {null | Object} Function returns either the user id or null.
   */
  async function authenticateUser(authorization) {
    let response;
    await db.collection('tokens').findOne({token: authorization})
        .then((v) => {
          response = v.userId;
        })
        .catch((err) => {
          response = null;
        });
    return response;
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
          salt,
          password: hash,
          valid: false,
          movies: [],
        };

        await db.collection('users').insertOne(user)
            .then((v) => {
              user.id = v.insertedId;
              res.send(user);
            })
            .catch((err) => {
              res.status(400).send({
                message: err.message,
              });
            });
      })
      .patch(async (req, res, next) => {
        const data = req.body;
        let userId;
        await authenticateUser(req.headers.authorization).then((v) => {
          userId = v;
        });
        let user = null;

        if (userId) {
          db.collection('users').findOne(
              {_id: new mongo.ObjectID(userId)},
              (err, result) => {
                if (err) {
                  res.status(400).send({
                    message: 'Deu Ruim Ze',
                  });
                } else {
                  user = result;
                  Object.keys(data).forEach((key) => {
                    if (key != 'password' && key != 'email') {
                      user[key] = data[key];
                    }
                  });
                  db.collection('users').updateOne(
                      {_id: new mongo.ObjectID(userId)},
                      {$set: user},
                      (err, result) => {
                        if (err) {
                          res.status(400).send({
                            message: 'Deu Ruim Ze',
                          });
                        } else {
                          res.send(user);
                        }
                      },
                  );
                }
              },
          );
        } else {
          res.status(405).send({
            message: 'Unauthorized access',
          });
        }
      });

  // LOGIN route
  app.route('/login')
      .post(async (req, res, next) => {
        console.log("Bateu");
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
});

app.listen(8080);

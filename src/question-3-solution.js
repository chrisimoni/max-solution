//const express = require(express); //ERROR
const express = require('express'); //corrected
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');

/**
 * Assume that these are error free.
 */
const User = require('./models/user');
const logger = require('./utils/logger');

const mongoDB = process.env.MONGO_URI;

const app = express();

mongoose.connect(mongoDB, { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

app.use(bodyParser.json());

// handler to save user
//app.get('/save', function(res, req) {//ERROR
app.get('/save', function(req, res) { //The first function parameter should be req
  //const user = new User(user); //ERROR, user is not defined
  let user = new User(req.user); //Assuming user is coming from probably a form

  /*
  REWRIING THIS CODE BELOW
  user.save(function(err) {
    if (err) {
      res.status(500).send(err);
      return logger.log(err);
    }
  });
*/
user.save()
    .then(() => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).send(err.message());
    });
});

const server = http.createServer(app);

server.listen(80, function() {
  db.on('error', function(error) {
    logger.log(error);
  });
});
'use strict';

function api(app) {
  const bcrypt = require('bcrypt-nodejs');
  const bodyParser = require("body-parser");
  const validation = require('./validation');
  const firebase = require('firebase');

  /** bodyParser.urlencoded(options)
   * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
   * and exposes the resulting object (containing the keys and values) on req.body
   */
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  /**bodyParser.json(options)
   * Parses the text as JSON and exposes the resulting object on req.body.
   */
  app.use(bodyParser.json());

  app.post('/api/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    /*
    bcrypt.hash("bacon", null, null, function(err, hash) {
      // Store hash in your password DB.
    });

// Load hash from your password DB.
    bcrypt.compare("bacon", hash, function(err, res) {
      // res == true
    });
    bcrypt.compare("veggies", hash, function(err, res) {
      // res = false
    });*/

    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);

    res.json({ test: "hello"});
  });

  app.post('/api/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);

    validation.checkIfUsernameExists(username).then(usernameExists => {
      if(usernameExists) {
        console.log('The username already exists.');
      } else {
        console.log('The username doesn\'t already exist.');

        bcrypt.hash(password, null, null, function(err, hash) {
          firebase.database().ref('/users/' + username).set({
            password_hash: hash,
            profilePicture: 'Docker-slacker',
          });
        });
      }
    });

    /*
    bcrypt.hash("bacon", null, null, function(err, hash) {
      // Store hash in your password DB.
    });

// Load hash from your password DB.
    bcrypt.compare("bacon", hash, function(err, res) {
      // res == true
    });
    bcrypt.compare("veggies", hash, function(err, res) {
      // res = false
    });*/

    res.json({ test: "hello"});
  });

  app.post('/api/logout', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    /*
    bcrypt.hash("bacon", null, null, function(err, hash) {
      // Store hash in your password DB.
    });

// Load hash from your password DB.
    bcrypt.compare("bacon", hash, function(err, res) {
      // res == true
    });
    bcrypt.compare("veggies", hash, function(err, res) {
      // res = false
    });*/

    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);

    res.json({ test: "hello"});
  });
}

module.exports = api;
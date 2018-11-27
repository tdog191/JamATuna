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

    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);

    res.json({ test: "hello"});
  });

  // Defines GET request to retrieve all jam rooms in Firebase
  app.get('/api/get_jam_rooms', function(req, res) {
    firebase.database().ref('/jam_rooms/').once('value')
      .then(snapshot => res.json(snapshot.val()))
      .catch(errorResponse => res.json(errorResponse));
  });

  // Defines POST request to let user create jam room
  app.post('/api/create_jam_room', function(req, res) {
    const jamRoomName = req.body.jam_room_name;
    const ownerUsername = req.body.owner_username;

    // Validate that the provided jam room exists
    validation.checkIfJamRoomExists(jamRoomName).then(jamRoomExists => {
      if(jamRoomExists) {
        // Redirect to error page when jam room already exists
        res.redirect('/html/jam_room_already_exists.html');
      } else {
        // Validate that the provided owner username exists
        validation.checkIfUsernameExists(ownerUsername).then(usernameExists => {
          if(!usernameExists) {
            // Redirect to error page when owner username does not exist
            res.redirect('/html/jam_room_owner_does_not_exist.html');
          } else {
            // Create jam room in Firebase
            firebase.database().ref('/jam_rooms/' + jamRoomName).update({
              members: [{username: ownerUsername}],
              owner: ownerUsername,
            });

            // Redirect to success page on success
            res.redirect('/html/jam_room_successfully_created.html');
          }
        });
      }
    });
  });

  // Defines POST request to let user join jam room
  app.post('/api/join_jam_room', function(req, res) {
    const jamRoomName = req.body.jam_room_name;
    const joinerUsername = req.body.joiner_username;

    // Validate that the provided jam room exists
    validation.checkIfJamRoomExists(jamRoomName).then(jamRoomExists => {
      if(!jamRoomExists) {
        // Redirect to error page when jam room does not exist
        res.redirect('/html/jam_room_does_not_exist.html');
      } else {
        // Validate that the provided joiner username exists
        validation.checkIfUsernameExists(joinerUsername).then(usernameExists => {
          if(!usernameExists) {
            // Redirect to error page when joiner username does not exist
            res.redirect('/html/jam_room_joiner_does_not_exist.html');
          } else {
            // Acquire the current list of members in the jam
            // room to append the joiner username to it
            firebase.database().ref('/jam_rooms/' + jamRoomName + '/members/').once('value')
                .then(snapshot => {
                  const members = snapshot.val();

                  // Append the new member to the list of jam room members
                  members.push({username: joinerUsername});

                  // Update the list of jam room members in Firebase
                  firebase.database().ref('/jam_rooms/' + jamRoomName).update({
                    members: members,
                  });

                  // Redirect to success page on success
                  res.redirect('/html/successfully_joined_jam_room.html');
                })
                .catch(errorResponse => res.json(errorResponse));
          }
        });
      }
    });
  });
}

module.exports = api;
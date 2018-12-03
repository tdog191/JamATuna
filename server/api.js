/**
 * @fileoverview Defines API on Express server to implement responses to GET and
 *     POST requests made by users and related server-side functionality.
 */

'use strict';

function api(app) {
  const bcrypt = require('bcrypt-nodejs');
  const bodyParser = require("body-parser");
  const validation = require('./validation');
  const firebase = require('firebase');

  /** From Stack Overflow post
   * (https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js)
   *
   * bodyParser.urlencoded(options)
   * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
   * and exposes the resulting object (containing the keys and values) on req.body
   */
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  /** From Stack Overflow post
   * (https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js)
   *
   * bodyParser.json(options)
   * Parses the text as JSON and exposes the resulting object on req.body.
   */
  app.use(bodyParser.json());

  // TODO: Consider implementing server-side rendering

  /*
  app.set('views', __dirname); // general config
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  */

  // Defines POST request to let user log in to his/her account
  app.post('/api/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that the provided username exists
    validation.checkIfUsernameExists(username).then(usernameExists => {
      if(!usernameExists) {
        // Redirect to error page when username does not exist
        res.redirect('/html/login_username_does_not_exist.html');
      } else {
        // Validate that the password is correct
        firebase.database().ref('/users/' + username).once('value')
            .then(queryResponse => {
              const passwordHash = queryResponse.val().password_hash;

              bcrypt.compare(password, passwordHash, function (err, passwordsMatch) {
                if (!passwordsMatch) {
                  // Redirect to error page when password is incorrect
                  res.redirect('/html/login_incorrect_password.html');
                } else {
                  // Redirect to success page on success
                  res.redirect('/html/login_successful.html');
                  //res.send({ username: username });
                }
              });
            })
            .catch(errorResponse => res.json(errorResponse));
      }
    });
  });

  // Defines POST request to let user sign up and create an account
  app.post('/api/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that the provided username does not exist
    validation.checkIfUsernameExists(username).then(usernameExists => {
      if(usernameExists) {
        // Redirect to error page when username already exists
        res.redirect('/html/signup_username_already_exists.html');
      } else {
        // Hash password then create user in Firebase
        bcrypt.hash(password, null, null, function(err, hash) {
          firebase.database().ref('/users/' + username).set({
            password_hash: hash,
          }).then(response => res.redirect('/html/signup_successful.html'))
        });
      }
    });
  });

  // TODO: Implement logout

  /*
  app.post('/api/logout', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);

    res.json({ test: "hello"});
  });
  */

  app.post('/api/change_profile_picture', function(req, res) {
    const username = req.body.username;
    const newProfilePictureType = req.body.newProfilePictureType;

    // Update the user's profile picture in Firebase
    firebase.database().ref('/users/' + username)
        .update({
          profile_picture: newProfilePictureType,
          profile_picture_data: null,
        })
        .then(response => res.json(response))
        .catch(errorResponse => res.json(errorResponse));
  });

  app.post('/api/upload_profile_picture', function(req, res) {
    const username = req.body.username;
    const newProfilePicture = req.body.newProfilePicture;

    // Update the user's profile picture in Firebase
    firebase.database().ref('/users/' + username)
        .update({
          profile_picture: 'other',
          profile_picture_data: newProfilePicture,
        })
        .then(response => res.json(response))
        .catch(errorResponse => res.json(errorResponse));
  });

  app.get('/api/profile/:username', function(req, res) {
    const username = req.params.username;

    firebase.database().ref('/users/' + username).once('value')
        .then(snapshot => {
          const user = snapshot.val();
          const profilePicture = user.profile_picture;
          const profilePictureData = user.profile_picture_data;

          res.json({
            profilePicture: profilePicture,
            profilePictureData: profilePictureData,
          });
        })
        .catch(errorResponse => res.json(errorResponse));

    /*
    console.log(username);

    res.render('\\signup_successful.html');

    res.render('/signup_successful.html', { username: username }, function(error, html) {
      res.send(html);
    });

    //res.json({ test: 'hello'});
    res.sendFile(__dirname + '\\signup_successful.html', {}, function(err) {
      if(err) {
        next(err)
      } else {
        console.log('Sent: ', __dirname + '\\signup_successful.html');
        next();
      }
    });
    */
  });

  // Defines GET request to retrieve all users in Firebase that have a
  // given prefix (ignoring case)
  app.get('/api/user_search', function(req, res) {
    const query = req.query.search_bar.toLowerCase();

    firebase.database().ref('/users/').once('value')
        .then(snapshot => {
          const users = snapshot.val();

          const results = Object.keys(users)
              .filter(user =>
                  new RegExp(`^${query}`).test(user.toLowerCase())
              );

          res.json(results);
        })
        .catch(errorResponse => res.json(errorResponse));
  });

  // Defines GET request to retrieve all jam rooms in Firebase that have a
  // given prefix (ignoring case)
  app.get('/api/jam_room_search', function(req, res) {
    const query = req.query.search_bar.toLowerCase();

    firebase.database().ref('/jam_rooms/').once('value')
        .then(snapshot => {
          const jamRooms = snapshot.val();

          const results = Object.keys(jamRooms)
              .filter(jamRoom =>
                  new RegExp(`^${query}`).test(jamRoom.toLowerCase())
              );

          res.json(results);
        })
        .catch(errorResponse => res.json(errorResponse));
  });

  // Defines GET request to retrieve all users in Firebase
  app.get('/api/get_users', function(req, res) {
    firebase.database().ref('/users/').once('value')
        .then(snapshot => res.json(snapshot.val()))
        .catch(errorResponse => res.json(errorResponse));
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

    // Validate that the provided jam room does not exist
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
            firebase.database().ref('/jam_rooms/' + jamRoomName).set({
              members: [{username: ownerUsername}],
              owner: ownerUsername,
            }).then(response => res.redirect('/html/jam_room_successfully_created.html'))
            .catch(errorResponse => res.json(errorResponse));
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
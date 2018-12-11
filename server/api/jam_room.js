/**
 * @fileoverview Defines API on Express server for jam-room-related
 *     functionality, such as searching for jam rooms and retrieving their chat
 *     history.
 */

'use strict';

function defineJamRoomAPI(app, firebaseHelper, validation) {
  // Defines GET request to retrieve all jam rooms in Firebase
  app.get('/api/get_jam_rooms', function(req, res) {
    // Define the Firebase parent node reference
    // and the callback to be executed on success
    const parentNodeReference = '/jam_rooms/';
    const successCallback = (snapshot) => res.json(snapshot.val());

    firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
  });

  // Defines GET request to retrieve a jam room's
  // owner and member list from Firebase
  app.get('/api/jam_room/:jamRoom', function(req, res) {
    const jamRoom = req.params.jamRoom;

    // Define the Firebase parent node reference
    // and the callback to be executed on success
    const parentNodeReference = '/jam_rooms/' + jamRoom;
    const successCallback = (snapshot) => {
      const jamRoom = snapshot.val();
      const owner = jamRoom.owner;
      const members = jamRoom.members;

      res.json({
        owner: owner,
        members: members,
      });
    };

    firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
  });

  // Defines GET request to retrieve a jam room's chat history from Firebase
  app.get('/api/get_chat_history/:jamRoom', function(req, res) {
    const jamRoom = req.params.jamRoom;

    // Define the Firebase parent node reference
    // and the callback to be executed on success
    const parentReference = '/jam_rooms/' + jamRoom + '/chat_history/';
    const successCallback = (snapshot) => {
      let chatHistory = snapshot.val();

      // If a chat history already exists for this jam room,
      // return it.  Otherwise, return an empty array.
      if(chatHistory) {
        chatHistory = Object.values(chatHistory);
      } else {
        chatHistory = [];
      }

      res.json({ chatHistory: chatHistory });
    };

    firebaseHelper.getSnapshot(parentReference, successCallback, res);
  });

  // Defines POST request to let a user create a jam room
  app.post('/api/create_jam_room', function(req, res) {
    const jamRoomName = req.body.jam_room_name;
    const ownerUsername = req.body.owner_username;

    // Validate that the provided jam room does not exist
    validation.checkIfJamRoomExists(jamRoomName).then(jamRoomExists => {
      if(jamRoomExists) {
        // Send error message when jam room already exists
        res.json({
          success: false,
          errorMessage: 'Jam room already exists.  Try again.',
        });
      } else {
        // Validate that the provided owner username exists
        validation.checkIfUsernameExists(ownerUsername).then(usernameExists => {
          if(!usernameExists) {
            // Send error message when owner username does not exist
            res.json({
              success: false,
              errorMessage: 'Owner username does not exist.  Try again.',
            });
          } else {
            // Create jam room in Firebase
            const parentReference = '/jam_rooms/' + jamRoomName;
            const data = {
              members: [{username: ownerUsername}],
              owner: ownerUsername,
            };
            const successCallback = function(response) {
              // Send redirect URL of success page on success
              res.json({
                success: true,
                redirectURL: '/html/jam_room_successfully_created.html',
              });
            };

            firebaseHelper.setData(parentReference, data, successCallback, res);
          }
        });
      }
    });
  });

  // Defines POST request to let a user join a jam room
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
            const parentNodeReference = '/jam_rooms/' + jamRoomName + '/members/';
            const successCallback = (snapshot) => {
              const members = snapshot.val();

              // Append the new member to the list of jam room members
              members.push({username: joinerUsername});

              // Update the list of jam room members in Firebase
              const updateParentNodeReference = '/jam_rooms/' + jamRoomName;
              const data = {
                members: members,
              };

              firebaseHelper.updateData(updateParentNodeReference, data, false, res);

              // Redirect to success page on success
              res.redirect('/html/successfully_joined_jam_room.html');
            };

            firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
          }
        });
      }
    });
  });
}

module.exports = defineJamRoomAPI;
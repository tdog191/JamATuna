/**
 * @fileoverview Defines API on Express server for searching for users and jam
 *     rooms.
 */

'use strict';

function defineSearchAPI(app, firebaseHelper) {
  // Defines GET request to retrieve all users in Firebase that have a
  // given prefix (ignoring case)
  app.get('/api/user_search', function(req, res) {
    const query = req.query.search_bar.toLowerCase();


    const parentNodeReference = '/users/';
    const successCallback = (snapshot) => {
      const users = snapshot.val();

      const results = Object.keys(users)
          .filter(user =>
              new RegExp(`^${query}`).test(user.toLowerCase())
          );

      res.json(results);
    };

    firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
  });

  // Defines GET request to retrieve all jam rooms in Firebase that have a
  // given prefix (ignoring case)
  app.get('/api/jam_room_search', function(req, res, next) {
    // Acquire all parameters from the query
    let nameQuery = null;
    if(req.query.search_by_name_bar) {
      nameQuery = req.query.search_by_name_bar.toLowerCase();
    }

    let ownerQuery = null;
    if(req.query.search_by_owner_bar) {
      ownerQuery = req.query.search_by_owner_bar.toLowerCase();
    }

    const minimumMemberQuery = req.query.search_by_minimum_number_of_members_bar;
    let errorMessage = null;

    // Acquire all jam rooms from firebase and filter
    // out the ones that meet the search criteria
    const parentNodeReference = '/jam_rooms/';
    const successCallback = (snapshot) => {
      const jamRooms = snapshot.val();
      let results = null;

      if(nameQuery) {
        results = Object.keys(jamRooms)
            .filter(jamRoom =>
                new RegExp(`^${nameQuery}`).test(jamRoom.toLowerCase())
            );
      } else if(ownerQuery) {
        results = Object.entries(jamRooms)
            .filter(([jamRoom, jamRoomData]) => {
              return new RegExp(`^${ownerQuery}`).test(jamRoomData.owner.toLowerCase());
            })
            .map(entry => entry[0]);
      } else if(minimumMemberQuery) {
        if(isNaN(minimumMemberQuery)) {
          // Minimum member query is not a number, so send 400 response
          errorMessage = 'Minimum member query is not a number';
        }

        results = Object.entries(jamRooms)
            .filter(([jamRoom, jamRoomData]) =>
                Object.keys(jamRoomData.members).length >= minimumMemberQuery
            )
            .map(entry => entry[0]);
      } else {
        // No query provided, so send 400 response
        errorMessage = 'No query provided';
      }

      if(!errorMessage) {
        res.json(results);
      } else {
        res.send({
          status: 400,
          errorMessage: errorMessage,
        });
      }
    };

    firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
  });
}

module.exports = defineSearchAPI;
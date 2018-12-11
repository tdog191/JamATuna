/**
 * @fileoverview Defines API on Express server for user-related
 *     functionality, such as retrieving all users in Firebase.
 */

'use strict';

function defineUserAPI(app, firebaseHelper) {
  // Defines GET request to retrieve all users in Firebase
  app.get('/api/get_users', function(req, res) {
    // Define the Firebase parent node reference
    // and the callback to be executed on success
    const parentNodeReference = '/users/';
    const successCallback = (snapshot) => res.json(snapshot.val());

    firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
  });
}

module.exports = defineUserAPI;
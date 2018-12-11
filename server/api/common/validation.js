/**
 * @fileoverview Defines helper functions for performing validation of requests
 *     to the Express server API using Firebase.
 */

'use strict';

const firebase = require('firebase');

/**
 * Callback to inspect a successful response to a Firebase query for the
 * existence of a value.
 *
 * @param queryResponse A successful response to a Firebase query
 * @returns true if a value exists in the response, false otherwise
 * @private
 */
function checkIfValueExists_(queryResponse) {
  const value = queryResponse.val();

  if (value) {
    return true;
  } else {
    return false;
  }
}

/**
 * Callback for when a Firebase operation fails.  It logs the
 * error response and returns it.
 *
 * @param errorResponse The error response to log
 * @returns {*} the error response
 * @private
 */
function handleFirebaseErrorResponse_(errorResponse) {
  console.error(errorResponse);

  return errorResponse;
}

/**
 * Query Firebase to check if the provided username exists.
 *
 * @returns {Promise<boolean | never>} true in a Promise if the query succeeds
 *     and the username exists, false in a Promise if the query succeeds and the
 *     username does not exist, or log and return the error response if the query fails
 */
function checkIfUsernameExists(username) {
  return firebase.database().ref('/users/' + username).once('value')
      .then(checkIfValueExists_)
      .catch(handleFirebaseErrorResponse_)
}

/**
 * Query Firebase to check if the jam room with the provided name exists.
 *
 * @returns {Promise<boolean | never>} true in a Promise if the query succeeds
 *     and the jam room exists, false in a Promise if the query succeeds and the
 *     jam room does not exist, or log and return the error response if the query fails
 */
function checkIfJamRoomExists(jamRoomName) {
  return firebase.database().ref('/jam_rooms/' + jamRoomName).once('value')
      .then(checkIfValueExists_)
      .catch(handleFirebaseErrorResponse_)
}

// Define all the functions in this file to be publicly available to other files
const validation = {
  checkIfUsernameExists: checkIfUsernameExists,
  checkIfJamRoomExists: checkIfJamRoomExists,
};

module.exports = validation;
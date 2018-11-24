'use strict';

/**
 * Callback for when the profile-search query on Firebase succeeds.  If no
 * profile data was retrieved from Firebase, a new profile-search query is
 * executed on GitHub.
 *
 * @param jsonResponse The response to the profile-search query containing the
 *     user's profile data on GitHub
 * @private
 */
function handleFirebaseSuccessfulResponse_(snapshot) {
  const username = snapshot.val();

  if (username) {
    return true;
  } else {
    return false;
  }
}

/**
 * Callback for when the profile-search query on Firebase fails.  It logs the
 * error response.
 *
 * @param errorResponse The response to the profile-search query when it fails
 * @private
 */
function handleFirebaseErrorResponse_(errorResponse) {
  console.error(errorResponse);
}

function checkIfUsernameExists(username) {
  const firebase = require('firebase');

  return firebase.database().ref('/users/' + username).once('value')
      .then(handleFirebaseSuccessfulResponse_)
      .catch(handleFirebaseErrorResponse_)
}

const validation = {
  checkIfUsernameExists: checkIfUsernameExists,
};

module.exports = validation;
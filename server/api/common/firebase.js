/**
 * @fileoverview Defines helper functions for performing Firebase operations
 *     within the Express server API.
 */

'use strict';

const firebase = require('firebase');
const defaultCallback = (res) => (response) => res.json(response);

function getSnapshot(parentNodeReference, successCallback, res) {
  return firebase.database().ref(parentNodeReference).once('value')
      .then(successCallback)
      .catch(defaultCallback(res));
}

function setData(parentNodeReference, data, successCallback, res) {
  return firebase.database().ref(parentNodeReference).set(data)
      .then(successCallback)
      .catch(defaultCallback(res));
}

function updateData(parentNodeReference, data, hasDefaultSuccessCallback, res) {
  if(hasDefaultSuccessCallback) {
    return firebase.database().ref(parentNodeReference).update(data)
        .then(defaultCallback(res))
        .catch(defaultCallback(res));
  } else {
    return firebase.database().ref(parentNodeReference).update(data)
        .catch(defaultCallback(res));
  }
}

// Define all the functions in this file to be publicly available to other files
const firebaseHelpers = {
  getSnapshot: getSnapshot,
  setData: setData,
  updateData: updateData,
};

module.exports = firebaseHelpers;
/**
 * @fileoverview Defines helper functions for performing Firebase operations
 *     within the Express server API.
 */

'use strict';

const firebase = require('firebase');
const defaultCallback = (res) => (response) => res.json(response);

/**
 * Retrieves the snapshot (value) associated with the provided node (key) in
 * Firebase.
 *
 * @param parentNodeReference The node whose value is to be retrieved
 * @param successCallback The callback to be executed upon successfully
 *     retrieving the value
 * @param res The response variable for sending an error response to the client
 * @returns {Promise<T | never>} The snapshot in a Promise if it is successfully
 *     retrieved, or return the error response to the client if the retrieval
 *     fails
 */
function getSnapshot(parentNodeReference, successCallback, res) {
  return firebase.database().ref(parentNodeReference).once('value')
      .then(successCallback)
      .catch(defaultCallback(res));
}

/**
 * Sets the value of the provided node (key) to the provided data.
 *
 * @param parentNodeReference The node whose value is to be set
 * @param data The data to set the value of the node to
 * @param successCallback The callback to be executed upon successfully
 *     setting the value of the node
 * @param res The response variable for sending an error response to the client
 * @returns {Promise<T | never>} The Promise associated with the Firebase 'set'
 *     operation
 */
function setData(parentNodeReference, data, successCallback, res) {
  return firebase.database().ref(parentNodeReference).set(data)
      .then(successCallback)
      .catch(defaultCallback(res));
}

/**
 * Updates only the provided portions of the value of the provided node.
 *
 * @param parentNodeReference The node whose value is to be updated
 * @param data The data to update the corresponding portions of the value of the
 *     node to
 * @param hasDefaultSuccessCallback Whether or not to execute the default
 *     success callback (sending the Firebase response back to the client)
 * @param res The response variable for sending a success/error response to the
 *     client
 * @returns {Promise<T | never>} The Promise associated with the Firebase
 *     'update' operation
 */
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
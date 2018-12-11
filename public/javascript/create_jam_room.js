/**
 * @fileoverview Defines the form validation and submission of the jam room
 *     creation page.  It is assumed this file is included in an HTML file along
 *     with 'form_validation.js' and 'form_submission.js'.
 */

'use strict';

/**
 * Acquires the data in the form when the form is submitted.
 *
 * @returns {Object} The data in the form to be acquired for submission
 */
function getFormDataCallback() {
  const jamRoomName = $('#jam_room_name').val();
  const ownerUsername = $('#owner_username').val();

  const formData = {
    jam_room_name: jamRoomName,
    owner_username: ownerUsername,
  };

  return formData;
}

/**
 * Redirects to the retrieved URL from the server on successful submission of
 * the jam room creation form.
 *
 * @param baseUrl The base of the URL address
 * @param data The response data from the server
 */
function postSuccessCallback(baseUrl, data) {
  if(data.success) {
    window.location.replace(baseUrl + data.redirectURL);
  } else {
    alert(data.errorMessage);
  }
}

/**
 * Defines the overall jquery functionality of the jam room creation webpage:
 * validating the form fields as the user types and when the form is submitted,
 * and posting the form to the server when the form submsission is valid.
 *
 * If the POST request succeeds, the user is redirected to the retrieved URL
 * from the server.  Otherwise, an alert with the received error message is
 * displayed to the user.
 */
$(function() {
  defineEventHandlers('create_jam_room_form');
  defineFormSubmissionHandler('create_jam_room_form', getFormDataCallback,
      '/api/create_jam_room', postSuccessCallback);
});
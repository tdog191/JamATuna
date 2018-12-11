/**
 * @fileoverview Defines the form validation and submission of the jam room
 *     joining page.  It is assumed this file is included in an HTML file along
 *     with 'form_validation.js' and 'form_submission.js'.
 */

'use strict';

/**
 * Acquires the data in the form when the form is submitted.
 *
 * @returns {Object} The data in the form to be acquired for submission
 */
function getFormDataCallback() {
  const jamRoomName = sessionStorage.getItem('jam_room');
  const joinerUsername = $('#username').val();

  const formData = {
    jam_room_name: jamRoomName,
    joiner_username: joinerUsername,
  };

  return formData;
}

/**
 * Redirects to the retrieved URL from the server on successful submission of
 * the jam room joining form.
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
 * Defines the overall jquery functionality of the jam room joining webpage:
 * validating the form fields as the user types and when the form is submitted,
 * and posting the form to the server when the form submsission is valid.
 *
 * If the POST request succeeds, the user is redirected to the retrieved URL
 * from the server.  Otherwise, an alert with the received error message is
 * displayed to the user.
 */
$(function() {
  defineEventHandlers('join_jam_room_form');
  defineFormSubmissionHandler('join_jam_room_form', getFormDataCallback,
      '/api/join_jam_room', postSuccessCallback);
});
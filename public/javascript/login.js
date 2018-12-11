/**
 * @fileoverview Defines the form validation and submission of the login page.
 *     It is assumed this file is included in an HTML file along with
 *     'form_validation.js' and 'form_submission.js'.
 */

'use strict';

/**
 * Acquires the data in the form when the form is submitted.
 *
 * @returns {Object} The data in the form to be acquired for submission
 */
function getFormDataCallback() {
  const username = $('#username').val();
  const password = $('#password').val();

  const formData = {
    username: username,
    password: password,
  };

  return formData;
}

/**
 * Saves the username in session storage and redirects to the retrieved URL from
 * the server (the homepage) on successful submission of the login form.
 *
 * @param baseUrl The base of the URL address
 * @param data The response data from the server
 */
function postSuccessCallback(baseUrl, data) {
  const username = $('#username').val();

  if(data.success) {
    sessionStorage.setItem('jamatuna_username', username);

    window.location.replace(baseUrl + data.redirectURL);
  } else {
    alert(data.errorMessage);
  }
}

/**
 * Defines the overall jquery functionality of the login webpage: validating
 * the form fields as the user types and when the form is submitted, and posting
 * the form to the server when the form submsission is valid.
 *
 * If the POST request succeeds, the submitted username is saved in session
 * storage and the user is redirected to the homepage.  Otherwise, an alert with
 * the received error message is displayed to the user.
 */
$(function() {
  defineEventHandlers('login_form');
  defineFormSubmissionHandler('login_form', getFormDataCallback, '/api/login',
      postSuccessCallback);
});
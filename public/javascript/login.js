/**
 * @fileoverview Defines helper functions for validating the form fields of the
 *     login page as the user types and when the form is submitted.
 */

'use strict';

const baseUrl = window.location.origin;

/**
 * Defines the 'keyup' and 'blur' event handlers for each field of the given
 * form to validate a field as the user releases a key and the field goes out
 * of focus (the user clicks or "tab-navigates" away from the field) respectively.
 */
function defineEventHandlers(formID) {
  const form_data = $('#' + formID).serializeArray();

  for (const input in form_data){
    const fieldName = form_data[input]['name'];

    $('#' + fieldName).on('keyup', function() {
      validateFieldIsNonempty(fieldName);
    });

    $('#' + fieldName).on('blur', function() {
      validateFieldIsNonempty(fieldName);
    });
  }
}

/**
 * Validates the given field to ensure it is nonempty.
 *
 * If the field is empty, feedback is displayed to the user to tell the user
 * that this is not allowed.  Otherwise, this feedback is hidden from the user.
 *
 * @param fieldName the name of the field to be validated
 * @returns {boolean} true if the field is nonempty, false otherwise
 */
function validateFieldIsNonempty(fieldName) {
  const value = $('#' + fieldName).val();

  // Check for empty string, null or undefined
  if(!value || value.length === 0) {
    $('#' + fieldName).addClass('is-invalid');
    $('#empty_' + fieldName + '_feedback').show();

    return false;
  } else {
    $('#' + fieldName).removeClass('is-invalid');
    $('#empty_' + fieldName + '_feedback').hide();

    return true;
  }
}

/**
 * Validates every field of the given form upon submission and cancels the
 * submission if any field is invalid.
 */
function validateFormOnSubmission(formID) {
  $('#' + formID).on('submit', function(event) {
    // Prevent the login form from submitting by default
    event.preventDefault();

    const form_data = $('#' + formID).serializeArray();
    let isValidForm = true;

    // Validate every field
    for (const input in form_data){
      const fieldName = form_data[input]['name'];

      if(!validateFieldIsNonempty(fieldName)) {
        isValidForm = false;
      }
    }

    // Cancels the form submission if any field is invalid
    if(!isValidForm) {
      return;
    }

    // Prepare POST request to server to login
    const username = $('#username').val();
    const password = $('#password').val();

    const data = {
      username: username,
      password: password,
    };

    const postRequestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    };

    // Post username and password to server to login, redirecting to success
    // page on success and displaying the received error message on failure
    fetch(baseUrl + '/api/login', postRequestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            sessionStorage.setItem('jamatuna_username', username);

            window.location.replace(baseUrl + data.redirectURL);
          } else {
            alert(data.errorMessage);
          }
        })
        .catch(errorResponse => {
          // Log error response and reload page in case of extreme failure
          console.log(errorResponse);

          location.reload();
        });
  });
}

/**
 * Defines the overall jquery functionality of the login webpage: validating
 * the form fields as the user types and when the form is submitted.
 */
$(function() {
  defineEventHandlers('login_form');
  validateFormOnSubmission('login_form');
});
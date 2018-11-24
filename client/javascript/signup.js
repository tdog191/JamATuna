/**
 * @fileoverview Defines helper methods for validating the form fields of the
 *     signup page as the user types and when the form is submitted.
 */

//TODO: Refactor login and signup pages to reuse duplicate code

'use strict';

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
      validateField(fieldName);
    });

    $('#' + fieldName).on('blur', function() {
      validateField(fieldName);
    });
  }
}

/**
 * Validates the given field to ensure it is nonempty and, in the case of the
 * "confirm_password" field, ensure the value matches the value of the "password"
 * field.
 *
 * If the field fails a validation check, feedback corresponding to the error is
 * displayed to the user.  Otherwise, this feedback is hidden from the user.
 *
 * @param fieldName the name of the field to be validated
 * @returns {boolean} true if the field is valid, false otherwise
 */
function validateField(fieldName) {
  const isNonempty = validateFieldIsNonempty(fieldName);
  let passwordsMatch = true;

  if(fieldName === 'confirm_password' && !validatePasswordsMatch()) {
    passwordsMatch = false;
  }

  if(isNonempty && passwordsMatch) {
    $('#' + fieldName).removeClass('is-invalid');

    return true;
  } else {
    $('#' + fieldName).addClass('is-invalid');

    return false;
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
    $('#empty_' + fieldName + '_feedback').show();

    return false;
  } else {
    $('#empty_' + fieldName + '_feedback').hide();

    return true;
  }
}

/**
 * Validates that the "password" and "confirm_password" field values match.
 *
 * If the values do not match, feedback is displayed to the user to tell the
 * user that this is not allowed.  Otherwise, this feedback is hidden from the
 * user.
 *
 * @returns {boolean} true if the passwords match, false otherwise
 */
function validatePasswordsMatch() {
  const password = $('#password').val();
  const confirm_password = $('#confirm_password').val();

  if(password !== confirm_password) {
    $('#unequal_confirm_password_feedback').show();

    return false;
  } else {
    $('#unequal_confirm_password_feedback').hide();

    return true;
  }
}

/**
 * Validates every field of the given form upon submission and cancels the
 * submission if any field is invalid.
 */
function validateFormOnSubmission(formID) {
  $('#' + formID).on('submit', function(event) {
    const form_data = $('#' + formID).serializeArray();
    let isValidForm = true;

    // Validate every field
    for (const input in form_data){
      const fieldName = form_data[input]['name'];

      if(!validateField(fieldName)) {
        isValidForm = false;
      }
    }

    // Cancels the form submission if any field is invalid
    if(!isValidForm) {
      event.preventDefault();
    }
  });
}

/**
 * Defines the overall jquery functionality of the signup webpage: validating
 * the form fields as the user types and when the form is submitted.
 */
$(function() {
  defineEventHandlers('signup_form');
  validateFormOnSubmission('signup_form');
});
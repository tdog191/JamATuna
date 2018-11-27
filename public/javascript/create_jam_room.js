/**
 * @fileoverview Defines helper functions for validating the form fields of the
 *     jam room creation page as the user types and when the form is submitted.
 */

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
      event.preventDefault();
    }
  });
}

/**
 * Defines the overall jquery functionality of the jam room creation webpage:
 * validating the form fields as the user types and when the form is submitted.
 */
$(function() {
  defineEventHandlers('create_jam_room_form');
  validateFormOnSubmission('create_jam_room_form');
});
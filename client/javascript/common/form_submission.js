/**
 * @fileoverview Defines a general handler for form submission.  It is assumed
 *     this file is included in an HTML file along with 'form_validation.js'.
 */

'use strict';

const baseUrl = window.location.origin;

/**
 * Defines a handler for submission of the given form that validates every
 * field, cancels the form submission if any field is invalid, submits a
 * POST request to the server with the form data at the given URL, and executes
 * the given callback when the POST request succeeds.
 *
 * @param formID The ID of the form HTML element
 * @param getFormDataCallback The function used to access the data in the form
 *     to post to the server
 * @param url The URL to post to
 * @param postSuccessCallback The callback to execute when the POST request
 *     succeeds
 */
function defineFormSubmissionHandler(formID, getFormDataCallback, url, postSuccessCallback) {
  $('#' + formID).on('submit', function(event) {
    // Prevent the form from submitting by default
    event.preventDefault();

    // Cancels the form submission if any field is invalid
    if(!validateFormOnSubmission(formID)) {
      return;
    }

    const formData = getFormDataCallback();

    // Prepare POST request to server
    const postRequestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
    };

    // Post to server
    fetch(baseUrl + url, postRequestOptions)
        .then(response => response.json())
        .then(data => postSuccessCallback(baseUrl, data))
        .catch(errorResponse => {
          // Log error response and reload page in case of extreme failure
          console.log(errorResponse);

          location.reload();
        });
  });
}
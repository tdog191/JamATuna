/**
 * @fileoverview Defines page load handler to display the appropriate buttons
 *     on loading the homepage and jquery handlers to handle the functionality
 *     of the "Profile" and "Logout" buttons.
 */

'use strict';

const baseUrl = window.location.origin;

/**
 * A handler to check which of the 'Login', 'Logout', and 'Profile' buttons
 * should be hidden depending on whether or not a user is logged in.
 *
 * This handler is executed when the page has loaded.
 */
window.onload = function() {
  const username = sessionStorage.getItem('jamatuna_username');

  if(username) {
    $('#login').hide();
  } else {
    $('#profile').hide();
    $('#logout').hide();
  }
};

/**
 * Defines page load handler to display the appropriate buttons
 *     on loading the homepage and jquery handlers to handle the functionality
 *     of the "Profile" and "Logout" buttons.
 */
/**
 * Defines the overall jquery functionality of the homepage: preparing the
 * profile page of a logged-in user when the 'Profile' button is clicked and
 * logging out a user when the 'Logout' button is clicked.
 */
$(function() {
  $('#profile').on('click', function(event) {
    const username = sessionStorage.getItem('jamatuna_username');

    sessionStorage.setItem('profile_username', username);
  });

  $('#logout').on('click', function() {
    sessionStorage.removeItem('jamatuna_username');
  });
});
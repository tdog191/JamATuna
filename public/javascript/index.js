'use strict';

const baseUrl = window.location.origin;

/**
 * A callback to check which of the 'Login', 'Logout', and 'Profile' buttons
 * should be hidden depending on whether or not a user is logged in.
 *
 * This callback is executed when the page has loaded.
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

$(function() {
  $('#profile').on('click', function(event) {
    const username = sessionStorage.getItem('jamatuna_username');

    sessionStorage.setItem('profile_username', username);
  });

  $('#logout').on('click', function() {
    sessionStorage.removeItem('jamatuna_username');
  });
});
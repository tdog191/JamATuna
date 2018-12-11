/**
 * @fileoverview Fetches a list of all users from the server and displays it
 *     according to search criteria.
 */

'use strict';

/**
 * Fetches and displays all existing users upon loading the page
 */
window.onload = function() {
  search('/api/get_users', false);
};

/**
 * Defines the overall jquery functionality of the user list webpage:
 * filtering users and redisplaying them based on the search criteria
 */
$(function() {
  $('#search').on('submit', function(event) {
    // Prevent the search form from submitting by default
    event.preventDefault();

    // Remove all currently displayed users
    $('#users').empty();

    const searchQuery = $('#search_bar').val().toLowerCase();

    filterByName(searchQuery, false);
  });
});
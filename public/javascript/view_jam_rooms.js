/**
 * @fileoverview Fetches a list of all jam rooms from the server and displays
 *     it according to search criteria.
 */

'use strict';

/**
 * Fetches and displays all existing jam rooms upon loading the page
 */
window.onload = function() {
  search('/api/get_jam_rooms', true);
};

/**
 * Defines the overall jquery functionality of the jam room viewing webpage:
 * filtering jam rooms and redisplaying them based on the search criteria
 */
$(function() {
  $('#search').on('submit', function(event) {
    // Prevent the search form from submitting by default
    event.preventDefault();

    // Remove all currently displayed jam rooms
    $('#jam_rooms').empty();

    const searchQuery = $('#search_bar').val().toLowerCase();

    const isSearchByOwner = $('#owner').hasClass('active');
    const isSearchByMinimumMembers = $('#minimum_number_of_members')
        .hasClass('active');

    if(isSearchByOwner) {
      filterByOwner(searchQuery);
    } else if(isSearchByMinimumMembers) {
      filterByMinimumMembers(searchQuery);
    } else {
      filterByName(searchQuery, true);
    }
  });
});
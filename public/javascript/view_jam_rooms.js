/**
 * @fileoverview Fetches a list of all jam rooms from the server and displays
 *     it.  Every odd-numbered jam room list entry is colored light-blue
 *     (has "list-group-item-info" class), and every even-numbered jam room list
 *     entry is colored green (has "list-group-item-success" class).
 */

'use strict';

const baseUrl = window.location.origin;

/**
 * Generates an HTML jam room list entry using jQuery.
 *
 * @param jamRoom The jam room inside the list entry
 * @param searchFilter The search filter list to append the jam room to
 * @param colorClassAttribute The class attribute that defines the color of the
 *     list entry
 */
function appendJamRoomListEntry(jamRoom, searchFilter, colorClassAttribute) {
  const classAttribute = [
    "list-group-item",
    "list-group-item-action",
    colorClassAttribute,
  ];

  const jamRoomListEntry =
      $(`<a href="jam_room.html" class="${classAttribute.join(' ')}">`);

  jamRoomListEntry.text(jamRoom);
  jamRoomListEntry.on('click', function(event) {
    sessionStorage.setItem('jam_room', jamRoom);
  });

  $('#jam_rooms_by_' + searchFilter).append(jamRoomListEntry);
}

function searchJamRooms(searchFilter) {
  // Prevent the search form from submitting
  event.preventDefault();

  // Remove any previous search results that may be present
  $('#jam_rooms_by_' + searchFilter).empty();

  const form_data = $('#search_by_' + searchFilter + '_bar').serializeArray();

  const query = Object.keys(form_data)
      .map(key => {
        const fieldKey = form_data[key]['name'];
        const fieldValue = form_data[key]['value'];

        return encodeURIComponent(fieldKey) + '=' + encodeURIComponent(fieldValue);
      })
      .join('&');

  fetch(baseUrl + '/api/jam_room_search?' + query)
      .then(response => response.json())
      .then(data => {
        /*
        console.log(data);

        if(data.status === 400 &&
            data.errorMessage === 'Minimum member query is not a number') {

        }*/

        let isBlueListEntry = true;

        // Display every retrieved jam room, alternating between light-blue
        // and green colors for each jam room list entry
        for(let index=0; index<data.length; index++) {
          const jamRoom = data[index];

          if(isBlueListEntry) {
            appendJamRoomListEntry(jamRoom, searchFilter, 'list-group-item-info');
          } else {
            appendJamRoomListEntry(jamRoom, searchFilter, 'list-group-item-success');
          }

          isBlueListEntry = !isBlueListEntry;
        }
      })
      .catch(errorResponse => console.log(errorResponse));
}

/**
 * Defines the overall jquery functionality of the jam room viewing webpage:
 * forming and sending a GET request to the server to retrieve all jam rooms
 * for each of the associated search filters, and displaying the
 * retrieved results on the page.
 */
$(function() {
  // Search for jam rooms with names that have the
  // provided prefix (ignoring case) and display them
  $('#search_by_name').on('submit', function(event) {
    searchJamRooms('name');
  });

  // Search for jam rooms with owner usernames that have
  // the provided prefix (ignoring case) and display them
  $('#search_by_owner').on('submit', function(event) {
    searchJamRooms('owner');
  });

  // Search for jam rooms with at least as many members
  // as the provided number and display them
  $('#search_by_minimum_number_of_members').on('submit', function(event) {
    searchJamRooms('minimum_number_of_members');
  });
});
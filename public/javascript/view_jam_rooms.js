/**
 * @fileoverview Fetches a list of all jam rooms from the server and displays
 *     it according to search criteria.  Every odd-numbered jam room list entry
 *     is colored light-blue (has "list-group-item-info" class), and every
 *     even-numbered jam room list entry is colored green
 *     (has "list-group-item-success" class).
 */

'use strict';

const baseUrl = window.location.origin;
let jamRooms = {};

/**
 * Generates an HTML jam room list entry using jQuery.
 *
 * @param jamRoom The jam room inside the list entry
 * @param colorClassAttribute The class attribute that defines the color of the
 *     list entry
 */
function appendJamRoomListEntry(jamRoom, colorClassAttribute) {
  const classAttribute = [
    "list-group-item",
    "list-group-item-action",
    colorClassAttribute,
  ];

  const jamRoomListEntry =
      $(`<a href="join_jam_room.html" class="${classAttribute.join(' ')}">`);

  jamRoomListEntry.text(jamRoom);
  jamRoomListEntry.on('click', function(event) {
    sessionStorage.setItem('jam_room', jamRoom);
  });

  $('#jam_rooms').append(jamRoomListEntry);
}

/**
 * Fetches all existing jam rooms, displays them, and saves them
 * so no further API calls will be necessary to filter them
 */
function searchJamRooms() {
  fetch(baseUrl + '/api/get_jam_rooms')
      .then(response => response.json())
      .then(data => {
        jamRooms = data;

        let isBlueListEntry = true;

        // Display every retrieved jam room, alternating between light-blue
        // and green colors for each jam room list entry
        Object.keys(data)
            .map(jamRoom => {
              if(isBlueListEntry) {
                appendJamRoomListEntry(jamRoom, 'list-group-item-info');
              } else {
                appendJamRoomListEntry(jamRoom, 'list-group-item-success');
              }

              isBlueListEntry = !isBlueListEntry;
            });
      })
      .catch(errorResponse => console.log(errorResponse));
}

/**
 * Fetches and displays all existing jam rooms upon loading the page
 */
window.onload = function() {
  searchJamRooms();
};

/**
 * Display only jam rooms with names that have the given prefix (ignoring case),
 * alternating between light-blue and green colors for each jam room list entry
 *
 * @param nameQuery The prefix to match jam room names against (ignoring case)
 */
function filterByName(nameQuery) {
  let isBlueListEntry = true;

  Object.keys(jamRooms)
      .filter(jamRoom =>
          new RegExp(`^${nameQuery}`).test(jamRoom.toLowerCase())
      ).map(jamRoom => {
        if(isBlueListEntry) {
          appendJamRoomListEntry(jamRoom, 'list-group-item-info');
        } else {
          appendJamRoomListEntry(jamRoom, 'list-group-item-success');
        }

        isBlueListEntry = !isBlueListEntry;
      });
}

/**
 * Display only jam rooms with owners that have usernames that have the given
 * prefix (ignoring case), alternating between light-blue and green colors for
 * each jam room list entry
 *
 * @param ownerQuery The prefix to match jam room owner usernames against
 *     (ignoring case)
 */
function filterByOwner(ownerQuery) {
  let isBlueListEntry = true;

  Object.entries(jamRooms)
      .filter(([jamRoom, jamRoomData]) =>
          new RegExp(`^${ownerQuery}`).test(jamRoomData.owner.toLowerCase())
      ).map(entry => entry[0])
      .map(jamRoom => {
        if(isBlueListEntry) {
          appendJamRoomListEntry(jamRoom, 'list-group-item-info');
        } else {
          appendJamRoomListEntry(jamRoom, 'list-group-item-success');
        }

        isBlueListEntry = !isBlueListEntry;
      });
}

/**
 * Display only jam rooms with at least as many members as the given number
 * alternating between light-blue and green colors for each jam room list entry
 *
 * @param minimumMemberQuery The minimum number of members a displayed jam room
 *     must have
 */
function filterByMinimumMembers(minimumMemberQuery) {
  let isBlueListEntry = true;

  Object.entries(jamRooms)
      .filter(([jamRoom, jamRoomData]) =>
          Object.keys(jamRoomData.members).length >= minimumMemberQuery
      ).map(entry => entry[0])
      .map(jamRoom => {
        if(isBlueListEntry) {
          appendJamRoomListEntry(jamRoom, 'list-group-item-info');
        } else {
          appendJamRoomListEntry(jamRoom, 'list-group-item-success');
        }

        isBlueListEntry = !isBlueListEntry;
      });
}

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
      filterByName(searchQuery);
    }
  });
});
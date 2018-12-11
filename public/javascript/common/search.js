/**
 * @fileoverview Fetches a list of data all from the server and displays
 *     it according to search criteria.  Every odd-numbered list entry is
 *     colored light-blue (has "list-group-item-info" class), and every
 *     even-numbered list entry is colored green (has "list-group-item-success"
 *     class).
 */

'use strict';

const baseUrl = window.location.origin;
let listEntries = {};

/**
 * Generates an HTML list entry using jQuery.
 *
 * @param listEntry The list entry
 * @param colorClassAttribute The class attribute that defines the color of the
 *     list entry
 * @param isJamRoomEntry True if the list entry represents a jam room, false if
 *     the list entry represents a user
 */
function appendListEntry(listEntry, colorClassAttribute, isJamRoomEntry) {
  const classAttribute = [
    "list-group-item",
    "list-group-item-action",
    colorClassAttribute,
  ];

  if(isJamRoomEntry) {
    const jamRoomListEntry =
        $(`<a href="join_jam_room.html" class="${classAttribute.join(' ')}">`);

    jamRoomListEntry.text(listEntry);
    jamRoomListEntry.on('click', function(event) {
      sessionStorage.setItem('jam_room', listEntry);
    });

    $('#jam_rooms').append(jamRoomListEntry);
  } else {
    const userListEntry =
        $(`<a href="profile.html" class="${classAttribute.join(' ')}">`);

    userListEntry.text(listEntry);
    userListEntry.on('click', function(event) {
      sessionStorage.setItem('profile_username', listEntry);
    });

    $('#users').append(userListEntry);
  }
}

/**
 * Fetches all existing entries, displays them, and saves them
 * so no further API calls will be necessary to filter them.
 *
 * @param fetchUrl The URL to fetch the entries from
 * @param isJamRoomEntry True if the list entry represents a jam room, false if
 *     the list entry represents a user
 */
function search(fetchUrl, isJamRoomEntry) {
  fetch(baseUrl + fetchUrl)
      .then(response => response.json())
      .then(data => {
        listEntries = data;

        let isBlueListEntry = true;

        // Display every retrieved list entry, alternating between
        // light-blue and green colors for each list entry
        Object.keys(data)
            .map(listEntry => {
              if(isBlueListEntry) {
                appendListEntry(listEntry, 'list-group-item-info', isJamRoomEntry);
              } else {
                appendListEntry(listEntry, 'list-group-item-success', isJamRoomEntry);
              }

              isBlueListEntry = !isBlueListEntry;
            });
      })
      .catch(errorResponse => console.log(errorResponse));
}

/**
 * Display only list entries with names that have the given prefix (ignoring
 * case), alternating between light-blue and green colors for each list entry.
 *
 * @param nameQuery The prefix to match list entry names against (ignoring case)
 */
function filterByName(nameQuery, isJamRoomEntry) {
  let isBlueListEntry = true;

  Object.keys(listEntries)
      .filter(listEntry =>
          new RegExp(`^${nameQuery}`).test(listEntry.toLowerCase())
      ).map(listEntry => {
        if(isBlueListEntry) {
          appendListEntry(listEntry, 'list-group-item-info', isJamRoomEntry);
        } else {
          appendListEntry(listEntry, 'list-group-item-success', isJamRoomEntry);
        }

        isBlueListEntry = !isBlueListEntry;
  });
}

/**
 * Display only jam rooms with owners that have usernames that have the given
 * prefix (ignoring case), alternating between light-blue and green colors for
 * each jam room list entry.  This function is intended to be used with the
 * jam room search page.
 *
 * @param ownerQuery The prefix to match jam room owner usernames against
 *     (ignoring case)
 */
function filterByOwner(ownerQuery) {
  let isBlueListEntry = true;

  Object.entries(listEntries)
      .filter(([jamRoom, jamRoomData]) =>
          new RegExp(`^${ownerQuery}`).test(jamRoomData.owner.toLowerCase())
      ).map(entry => entry[0])
      .map(jamRoom => {
        if(isBlueListEntry) {
          appendListEntry(jamRoom, 'list-group-item-info', true);
        } else {
          appendListEntry(jamRoom, 'list-group-item-success', true);
        }

        isBlueListEntry = !isBlueListEntry;
      });
}

/**
 * Display only jam rooms with at least as many members as the given number,
 * alternating between light-blue and green colors for each jam room list entry.
 * This function is intended to be used with the jam room search page.
 *
 * @param minimumMemberQuery The minimum number of members a displayed jam room
 *     must have
 */
function filterByMinimumMembers(minimumMemberQuery) {
  let isBlueListEntry = true;

  Object.entries(listEntries)
      .filter(([jamRoom, jamRoomData]) =>
          Object.keys(jamRoomData.members).length >= minimumMemberQuery
      ).map(entry => entry[0])
      .map(jamRoom => {
        if(isBlueListEntry) {
          appendListEntry(jamRoom, 'list-group-item-info', true);
        } else {
          appendListEntry(jamRoom, 'list-group-item-success', true);
        }

        isBlueListEntry = !isBlueListEntry;
      });
}
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
 * @param colorClassAttribute The class attribute that defines the color of the
 *     list entry
 */
function appendJamRoomListEntry(jamRoom, colorClassAttribute) {
  const classAttribute = [
    "list-group-item",
    "list-group-item-action",
    colorClassAttribute,
  ];

  $('#active_jam_rooms').append(
      $(`<a href="profile.html" class="${classAttribute.join(' ')}">`)
          .text(jamRoom));
}

window.onload = function() {
  fetch(baseUrl + '/api/get_jam_rooms')
    .then(response => response.json())
    .then(data => {
      let isBlueListEntry = true;

      // Display every retrieved jam room, alternating between light-blue
      // and green colors for each jam room list entry
      for(const jamRoom in data) {
        if(isBlueListEntry) {
          appendJamRoomListEntry(jamRoom, 'list-group-item-info');
        } else {
          appendJamRoomListEntry(jamRoom, 'list-group-item-success');
        }

        isBlueListEntry = !isBlueListEntry;
      }
    });
};
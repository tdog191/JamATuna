/**
 * @fileoverview Fetches a list of all users from the server and displays it.
 *     Every odd-numbered user list entry is colored light-blue
 *     (has "list-group-item-info" class), and every even-numbered user list
 *     entry is colored green (has "list-group-item-success" class).
 */

//TODO: Refactor users.js and view_jam_rooms.js to reuse duplicate code

'use strict';

const baseUrl = window.location.origin;

/**
 * Generates an HTML user list entry using jQuery.
 *
 * @param username The username inside the list entry
 * @param colorClassAttribute The class attribute that defines the color of the
 *     list entry
 */
function appendUserListEntry(username, colorClassAttribute) {
  const classAttribute = [
    "list-group-item",
    "list-group-item-action",
    colorClassAttribute,
  ];

  $('#users').append(
      $(`<a href="profile.html" class="${classAttribute.join(' ')}">`)
          .text(username));
}

window.onload = function() {
  fetch(baseUrl + '/api/get_users')
      .then(response => response.json())
      .then(data => {
        let isBlueListEntry = true;

        // Display every retrieved user, alternating between light-blue
        // and green colors for each user list entry
        for(const user in data) {
          if(isBlueListEntry) {
            appendUserListEntry(user, 'list-group-item-info');
          } else {
            appendUserListEntry(user, 'list-group-item-success');
          }

          isBlueListEntry = !isBlueListEntry;
        }
      });
};
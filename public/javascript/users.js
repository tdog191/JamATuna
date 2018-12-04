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

  const userListEntry =
      $(`<a href="profile.html" class="${classAttribute.join(' ')}">`);

  userListEntry.text(username);
  userListEntry.on('click', function(event) {
    sessionStorage.setItem('profile_username', username);
  });

  $('#users').append(userListEntry);
}

/**
 * Defines the overall jquery functionality of the user list webpage:
 * forming and sending a GET request to the server to retrieve all users
 * whose names have the provided prefix (ignoring case), and displaying the
 * retrieved results on the page.
 */
$(function() {
  $('#user_search').on('submit', function(event) {
    // Prevent the user search form from submitting
    event.preventDefault();

    $('#users').empty();

    const form_data = $('#search_bar').serializeArray();

    const query = Object.keys(form_data)
        .map(key => {
          const fieldKey = form_data[key]['name'];
          const fieldValue = form_data[key]['value'];

          return encodeURIComponent(fieldKey) + '=' + encodeURIComponent(fieldValue);
        })
        .join('&');

    fetch(baseUrl + '/api/user_search?' + query)
        .then(response => response.json())
        .then(data => {
          let isBlueListEntry = true;

          // Display every retrieved user, alternating between light-blue
          // and green colors for each user list entry
          for(let index=0; index<data.length; index++) {
            const user = data[index];

            if(isBlueListEntry) {
              appendUserListEntry(user, 'list-group-item-info');
            } else {
              appendUserListEntry(user, 'list-group-item-success');
            }

            isBlueListEntry = !isBlueListEntry;
          }
        });
  })
});
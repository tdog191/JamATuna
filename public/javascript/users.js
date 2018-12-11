/**
 * @fileoverview Fetches a list of all users from the server and displays it.
 *     Every odd-numbered user list entry is colored light-blue
 *     (has "list-group-item-info" class), and every even-numbered user list
 *     entry is colored green (has "list-group-item-success" class).
 */

//TODO: Refactor users.js and view_jam_rooms.js to reuse duplicate code

'use strict';

const baseUrl = window.location.origin;
let users = {};

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
 * Fetches all existing users, displays them, and saves them
 * so no further API calls will be necessary to filter them
 */
function searchUsers() {
  fetch(baseUrl + '/api/get_users')
      .then(response => response.json())
      .then(data => {
        users = data;

        let isBlueListEntry = true;

        // Display every retrieved user, alternating between light-blue
        // and green colors for each jam room list entry
        Object.keys(data)
            .map(user => {
              if(isBlueListEntry) {
                appendUserListEntry(user, 'list-group-item-info');
              } else {
                appendUserListEntry(user, 'list-group-item-success');
              }

              isBlueListEntry = !isBlueListEntry;
            });
      })
      .catch(errorResponse => console.log(errorResponse));
}

/**
 * Fetches and displays all existing users upon loading the page
 */
window.onload = function() {
  searchUsers();
};

/**
 * Display only users with usernames that have the given prefix (ignoring case),
 * alternating between light-blue and green colors for each jam room list entry
 *
 * @param nameQuery The prefix to match usernames against (ignoring case)
 */
function filterByName(nameQuery) {
  let isBlueListEntry = true;

  Object.keys(users)
      .filter(username =>
          new RegExp(`^${nameQuery}`).test(username.toLowerCase())
      ).map(username => {
        if(isBlueListEntry) {
          appendUserListEntry(username, 'list-group-item-info');
        } else {
          appendUserListEntry(username, 'list-group-item-success');
        }

        isBlueListEntry = !isBlueListEntry;
      });
}

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

    filterByName(searchQuery);
  });
});
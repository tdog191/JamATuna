/**
 * @fileoverview Defines the functionality of the jam room page.
 *
 *     One function is to fetch the owner of the jam room and the list of its
 *     members to display them on the webpage.  Every odd-numbered user list
 *     entry is colored light-blue (has "list-group-item-info" class), and every
 *     even-numbered user list entry is colored green
 *     (has "list-group-item-success" class).
 *
 *     The jQuery functionality to update the title of the jam room page with
 *     the name of the jam room is also defined in this file.
 */

'use strict';

const baseUrl = window.location.origin;

/**
 * Generates an HTML member list entry using jQuery.
 *
 * @param username The username inside the list entry
 * @param isOwner Whether or not the entry is for the 'Owner' section of the
 *     webpage
 * @param colorClassAttribute The class attribute that defines the color of the
 *     list entry
 */
function appendMemberListEntry(username, isOwner, colorClassAttribute) {
  const classAttribute = [
    "list-group-item",
    "list-group-item-action",
    colorClassAttribute,
  ];

  const memberListEntry =
      $(`<a href="profile.html" class="${classAttribute.join(' ')}">`);

  memberListEntry.text(username);
  memberListEntry.on('click', function(event) {
    sessionStorage.setItem('profile_username', username);
  });

  if(isOwner) {
    $('#owner_username').append(memberListEntry);
  } else {
    $('#member_usernames').append(memberListEntry);
  }
}

window.onload = function() {
  const jamRoom = sessionStorage.getItem('jam_room');
  const username = sessionStorage.getItem('jamatuna_username');

  /*
  if(!username) {

    window.
    window.location.replace(baseUrl + '');
  }*/

  $('#page_header').text('Welcome to ' + jamRoom + '!');

  fetch(baseUrl + '/api/jam_room/' + jamRoom)
      .then(response => response.json())
      .then(data => {
        const owner = data.owner;
        const members = data.members;

        appendMemberListEntry(owner, true, 'list-group-item-info');

        let isBlueListEntry = true;

        // Display every retrieved member, alternating between light-blue
        // and green colors for each member list entry
        for(let index=0; index<members.length; index++) {
          const member = members[index].username;

          if(isBlueListEntry) {
            appendMemberListEntry(member, false, 'list-group-item-info');
          } else {
            appendMemberListEntry(member, false, 'list-group-item-success');
          }

          isBlueListEntry = !isBlueListEntry;
        }
      });
};
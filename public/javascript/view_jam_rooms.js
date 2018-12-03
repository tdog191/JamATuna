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

/*
window.onload = function() {
  fetch(baseUrl + '/api/get_jam_rooms')
    .then(response => response.json())
    .then(data => {
      console.log(data);

      let isBlueListEntry = true;

      // Display every retrieved jam room, alternating between light-blue
      // and green colors for each jam room list entry
      for(const jamRoom in data) {
        console.log(jamRoom);
        if(isBlueListEntry) {
          appendJamRoomListEntry(jamRoom, 'list-group-item-info');
        } else {
          appendJamRoomListEntry(jamRoom, 'list-group-item-success');
        }

        isBlueListEntry = !isBlueListEntry;
      }
    });
};
*/

/**
 * Defines the overall jquery functionality of the jam room viewing webpage:
 * forming and sending a GET request to the server to retrieve all jam rooms
 * whose names have the provided prefix (ignoring case), and displaying the
 * retrieved results on the page.
 */
$(function() {
  $('#jam_room_search').on('submit', function(event) {
    // Prevent the jam room search form from submitting
    event.preventDefault();

    $('#active_jam_rooms').empty();

    const form_data = $('#search_bar').serializeArray();

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
          let isBlueListEntry = true;

          // Display every retrieved jam room, alternating between light-blue
          // and green colors for each jam room list entry
          for(let index=0; index<data.length; index++) {
            const jamRoom = data[index];

            if(isBlueListEntry) {
              appendJamRoomListEntry(jamRoom, 'list-group-item-info');
            } else {
              appendJamRoomListEntry(jamRoom, 'list-group-item-success');
            }

            isBlueListEntry = !isBlueListEntry;
          }
        });
  })
});
'use strict';

const baseUrl = window.location.origin;

window.onload = function() {
  fetch(baseUrl + '/api/get_jam_rooms')
    .then(response => response.json())
    .then(data => {
      for(const jamRoom in data) {
        $('#active_jam_rooms').append(
            $('<a href="profile.html" class="list-group-item list-group-item-info list-group-item-action">')
                .text(jamRoom));
      }
    })
};
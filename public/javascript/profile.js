/**
 * @fileoverview Defines jQuery functionality to update displayed profile
 *     picture depending on user selection in "Settings" tab.
 */

'use strict';

const baseUrl = window.location.origin;
let initialProfilePicture = null;
let currentProfilePicture = null;

window.onload = function() {
  const username = sessionStorage.getItem('profile_username');

  // Set username text beneath the profile picture
  $('#username').text(username);

  // Hide 'Save Changes' button when loading the page
  $('#save_changes').hide();

  fetch(baseUrl + '/api/profile/' + username)
      .then(response => response.json())
      .then(data => {
        initialProfilePicture = data.profilePicture;
        currentProfilePicture = initialProfilePicture;
        const profilePictureData = data.profilePictureData;

        // Initialize the selection bar to the option that
        // represents the initial type of profile picture
        $(`#selectProfileImage option[id="${initialProfilePicture}"]`)
            .attr('selected', true);

        if(initialProfilePicture === "other") {
          $('#upload-profile-picture').show();
        }

        if(initialProfilePicture === 'orange_fish') {
          $('#profile-picture').attr('src', '/images/orange-fish.png');
        } else if(initialProfilePicture === 'blue_fish') {
          $('#profile-picture').attr('src', '/images/blue-fish.jpg');
        } else if(initialProfilePicture === 'clown_fish') {
          $('#profile-picture').attr('src', '/images/clown-fish.jpg');
        } else if(initialProfilePicture === 'tuna') {
          $('#profile-picture').attr('src', '/images/tuna.jpg');
        } else if(initialProfilePicture === 'jamatuna') {
          $('#profile-picture').attr('src', '/images/jamatuna.png');
        } else if(profilePictureData) {
          $('#profile-picture').attr('src', profilePictureData);
        }
      });
};

$(function() {
  $('#change-profile-picture').on('submit', function(event) {
    // Prevent the profile picture change form from submitting
    event.preventDefault();

    const username = sessionStorage.getItem('profile_username');
    const newProfilePictureType = $('#selectProfileImage').val();

    const data = {
      username: username,
      newProfilePictureType: newProfilePictureType,
    };

    const postRequestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    };

    fetch(baseUrl + '/api/change_profile_picture', postRequestOptions)
        .then(successResponse => {
          console.log(successResponse);

          location.reload();
        })
        .catch(errorResponse => {
          console.log(errorResponse);

          location.reload();
        });
  });

  $('#upload-profile-picture').on('submit', function(event) {
    // Prevent the profile picture upload form from submitting
    event.preventDefault();

    const username = sessionStorage.getItem('profile_username');
    const reader = new FileReader();

    reader.onload = function(image) {
      const newProfilePicture = image.target.result;

      const data = {
        username: username,
        newProfilePicture: newProfilePicture,
      };

      const postRequestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      };

      fetch(baseUrl + '/api/upload_profile_picture', postRequestOptions)
          .then(successResponse => {
            console.log(successResponse);

            location.reload();
          })
          .catch(errorResponse => {
            console.log(errorResponse);

            location.reload();
          });
    };

    reader.readAsDataURL($('#file')[0].files[0]);
  });

  // Update displayed profile picture whenever
  // user selects profile picture to upload
  $('#file').change(function() {
    const reader = new FileReader();

    reader.onload = function(image) {
      $('#profile-picture').attr('src', image.target.result);
    };

    reader.readAsDataURL(this.files[0]);
  });

  // Update displayed profile picture depending on user selection in "Settings"
  // tab and display picture upload button accordingly
  $('#selectProfileImage').on('change', function() {
    $('#upload-profile-picture').hide();

    const selectedOption = $(this).val();

    if(selectedOption === 'orange_fish') {
      $('#profile-picture').attr('src', '/images/orange-fish.png');
      currentProfilePicture = 'orange_fish';
    } else if(selectedOption === 'blue_fish') {
      $('#profile-picture').attr('src', '/images/blue-fish.jpg');
      currentProfilePicture = 'blue_fish';
    } else if(selectedOption === 'clown_fish') {
      $('#profile-picture').attr('src', '/images/clown-fish.jpg');
      currentProfilePicture = 'clown_fish';
    } else if(selectedOption === 'tuna') {
      $('#profile-picture').attr('src', '/images/tuna.jpg');
      currentProfilePicture = 'tuna';
    } else if(selectedOption === 'jamatuna') {
      $('#profile-picture').attr('src', '/images/jamatuna.png');
      currentProfilePicture = 'jamatuna';
    } else {
      $('#upload-profile-picture').show();
      currentProfilePicture = 'other';
    }

    if(currentProfilePicture !== 'other' &&
        currentProfilePicture !== initialProfilePicture) {
      $('#save_changes').show();
    } else {
      $('#save_changes').hide();
    }
  });
});
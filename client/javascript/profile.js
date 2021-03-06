/**
 * @fileoverview Defines functionality to fetch and display the user's profile
 *     info and update the profile picture in the "Settings" tab.
 */

'use strict';

const baseUrl = window.location.origin;
let initialProfilePicture = null;
let currentProfilePicture = null;

/**
 * Displays the user's username and fetches and displays the user's profile
 * picture upon loading the page.
 *
 * The 'Save Changes' button is also hidden.
 */
window.onload = function() {
  const username = sessionStorage.getItem('profile_username');
  const arrivedFromHomepage = sessionStorage.getItem('arrived_from_homepage');

  // Make "Go Back" button redirect to home page instead of user search
  // page when arriving at the profile page from the homepage
  if(arrivedFromHomepage) {
    $('#go_back').attr('href', '/html/index.html');
  }

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

/**
 * Defines the overall jquery functionality of the profile page: updating the
 * displayed profile picture when the user changes it and posting to the
 * server when a user changes and saves/uploads his/her new profile picture.
 */
$(function() {
  // Post to server when a user selects a provided
  // profile picture as his/her new profile picture
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

  // Upload profile picture to server when new profile
  // picture is submitted in the "Settings" tab
  $('#upload-profile-picture').on('submit', function(event) {
    // Prevent the profile picture upload form from submitting
    event.preventDefault();

    const username = sessionStorage.getItem('profile_username');
    const reader = new FileReader();

    reader.onload = function(image) {
      const newProfilePictureData = image.target.result;

      const data = {
        username: username,
        newProfilePictureType: 'other',
        newProfilePictureData: newProfilePictureData,
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

  // Remove 'arrived_from_homepage' from session storage upon clicking the
  // "Go Back" button to avoid redirecting to the homepage in the future unless
  // arriving at the profile page from the homepage.
  $('#go_back').on('click', function(event) {
    sessionStorage.removeItem('arrived_from_homepage');
  });
});
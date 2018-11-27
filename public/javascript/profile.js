/**
 * @fileoverview Defines jQuery functionality to update displayed profile
 *     picture depending on user selection in "Settings" tab.
 */

'use strict';

$(function() {
  // Update displayed profile picture whenever
  // user selects profile picture to upload
  $('#file').change(function() {
    var reader = new FileReader();

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

    if(selectedOption === 'Orange Fish') {
      $('#profile-picture').attr('src', '/images/orange-fish.png');
    } else if(selectedOption === 'Blue Fish') {
      $('#profile-picture').attr('src', '/images/blue-fish.jpg');
    } else if(selectedOption === 'Clown Fish') {
      $('#profile-picture').attr('src', '/images/clown-fish.jpg');
    } else if(selectedOption === 'Tuna') {
      $('#profile-picture').attr('src', '/images/tuna.jpg');
    } else if(selectedOption === 'JamATuna') {
      $('#profile-picture').attr('src', '/images/jamatuna.png');
    } else {
      $('#upload-profile-picture').show();
    }
  });
});
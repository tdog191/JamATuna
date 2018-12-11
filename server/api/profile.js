/**
 * @fileoverview Defines API on Express server for profile-related
 *     functionality, such as acquiring a user's profile information and
 *     changing/uploading a profile picture.
 */

'use strict';

function defineProfileAPI(app, firebaseHelper) {
  // Defines POST request to let user change/upload his/her profile picture
  app.post('/api/change_profile_picture', function(req, res) {
    const username = req.body.username;
    const newProfilePictureType = req.body.newProfilePictureType;
    
    // If this is a profile picture upload, retrieve the profile picture data
    let newProfilePictureData = null;
    if(newProfilePictureType === 'other') {
      newProfilePictureData = req.body.newProfilePictureData;
    } else {
      newProfilePictureData = null;
    }

    // Update the user's profile picture in Firebase
    const parentReference = '/users/' + username;
    const data = {
      profile_picture_type: newProfilePictureType,
      profile_picture_data: newProfilePictureData,
    };

    firebaseHelper.updateData(parentReference, data, true, res);
  });

  // Defines GET request to retrieve a user's profile
  // picture and its data from Firebase
  app.get('/api/profile/:username', function(req, res) {
    const username = req.params.username;

    const parentReference = '/users/' + username;
    const successCallback = (snapshot) => {
      const user = snapshot.val();
      const profilePicture = user.profile_picture_type;
      const profilePictureData = user.profile_picture_data;

      res.json({
        profilePicture: profilePicture,
        profilePictureData: profilePictureData,
      });
    };

    firebaseHelper.getSnapshot(parentReference, successCallback, res);
  });
}

module.exports = defineProfileAPI;
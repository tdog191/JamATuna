/**
 * @fileoverview Defines API on Express server for signup functionality.
 */

'use strict';

function defineSignupAPI(app, firebaseHelper, validation, bcrypt) {
  // Defines POST request to let user sign up and create an account
  app.post('/api/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that the provided username does not exist
    validation.checkIfUsernameExists(username).then(usernameExists => {
      if(usernameExists) {
        // Send error message when username already exists
        res.json({
          success: false,
          errorMessage: 'Username already exists.  Try again.',
        });
      } else {
        // Hash password then create user in Firebase
        bcrypt.hash(password, null, null, function(err, hash) {
          const parentNodeReference = '/users/' + username;
          const data = {
            password_hash: hash,
          };
          const successCallback = function(response) {
            // Send redirect URL of success page on success
            res.json({
              success: true,
              redirectURL: '/html/index.html',
            });
          };

          firebaseHelper.setData(parentNodeReference, data, successCallback, res);
        });
      }
    });
  });
}

module.exports = defineSignupAPI;




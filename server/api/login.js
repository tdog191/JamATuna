/**
 * @fileoverview Defines API on Express server for login functionality.
 */

'use strict';

function defineLoginAPI(app, firebaseHelper, validation, bcrypt) {
  // Defines POST request to let user log in to his/her account
  app.post('/api/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that the provided username exists
    validation.checkIfUsernameExists(username).then(usernameExists => {
      if(!usernameExists) {
        // Send error message when username does not exist
        res.json({
          success: false,
          errorMessage: 'Username does not exist.  Try again.',
        });
      } else {
        // Validate that the password is correct
        const parentNodeReference = '/users/' + username;
        const successCallback = (queryResponse) => {
          const passwordHash = queryResponse.val().password_hash;

          bcrypt.compare(password, passwordHash, function (err, passwordsMatch) {
            if (!passwordsMatch) {
              // Send error message when password is incorrect
              res.json({
                success: false,
                errorMessage: 'Incorrect password.  Try again.',
              });
            } else {
              // Send redirect URL of success page on success
              res.json({
                success: true,
                redirectURL: '/html/login_successful.html',
              });
            }
          });
        };

        firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
      }
    });
  });
}

module.exports = defineLoginAPI;
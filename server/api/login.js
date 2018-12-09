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
        // Redirect to error page when username does not exist
        res.redirect('/html/login_username_does_not_exist.html');
      } else {
        // Validate that the password is correct
        const parentNodeReference = '/users/' + username;
        const successCallback = (queryResponse) => {
          const passwordHash = queryResponse.val().password_hash;

          bcrypt.compare(password, passwordHash, function (err, passwordsMatch) {
            if (!passwordsMatch) {
              // Redirect tfio error page when password is incorrect
              res.redirect('/html/login_incorrect_password.html');
            } else {
              // Redirect to success page on success
              res.redirect('/html/login_successful.html');
            }
          });
        };

        firebaseHelper.getSnapshot(parentNodeReference, successCallback, res);
      }
    });
  });
}

module.exports = defineLoginAPI;
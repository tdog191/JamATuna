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
        // Redirect to error page when username already exists
        res.redirect('/html/signup_username_already_exists.html');
      } else {
        // Hash password then create user in Firebase
        bcrypt.hash(password, null, null, function(err, hash) {
          const parentNodeReference = '/users/' + username;
          const data = {
            password_hash: hash,
          };
          const successCallback = (response) => res.redirect('/html/signup_successful.html');

          firebaseHelper.setData(parentNodeReference, data, successCallback, res);
        });
      }
    });
  });
}

module.exports = defineSignupAPI;




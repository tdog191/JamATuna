/**
 * @fileoverview Defines all API endpoints in this directory
 *     whenever the Express server starts up.
 */

'use strict';

function defineAPI(app) {
  const firebaseHelper = require('./common/firebase');
  const validation = require('./common/validation');
  const bcrypt = require('bcrypt-nodejs');

  const bodyParser = require("body-parser");

  /** From Stack Overflow post
   * (https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js)
   *
   * bodyParser.urlencoded(options)
   * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
   * and exposes the resulting object (containing the keys and values) on req.body
   */
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  /** From Stack Overflow post
   * (https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js)
   *
   * bodyParser.json(options)
   * Parses the text as JSON and exposes the resulting object on req.body.
   */
  app.use(bodyParser.json());

  const jamRoomAPI = require('./jam_room')(app, firebaseHelper, validation);
  const loginAPI = require('./login')(app, firebaseHelper, validation, bcrypt);
  const profileAPI = require('./profile')(app, firebaseHelper);
  const searchAPI = require('./search')(app, firebaseHelper);
  const signupAPI = require('./signup')(app, firebaseHelper, validation, bcrypt);
}

module.exports = defineAPI;
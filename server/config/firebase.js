'use strict';

function configureFirebase() {
  const firebase = require('firebase');
  const firebaseConfig = require('./secret_config').firebaseConfig;

  firebase.initializeApp(firebaseConfig);
}

module.exports = configureFirebase;
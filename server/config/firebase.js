'use strict';

function configureFirebase() {
  const firebase = require('firebase');

  const firebaseConfig = {
    apiKey: "AIzaSyA4eLoMXqPmz-QchOzWaVT1LJ6R3LDOE4k",
    authDomain: "jamatuna.firebaseapp.com",
    databaseURL: "https://jamatuna.firebaseio.com",
    projectId: "jamatuna",
    storageBucket: "jamatuna.appspot.com",
    messagingSenderId: "771905743407"
  };
  firebase.initializeApp(firebaseConfig);
}

module.exports = configureFirebase;
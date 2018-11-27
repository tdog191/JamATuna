'use strict';

function configureServer(io) {
  const firebaseConfig = require('./firebase')();
  const socketIoConfig = require('./socket_io')(io);
}

module.exports = configureServer;
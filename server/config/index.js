/**
 * @fileoverview Runs all the configuration operations in this directory
 *     whenever the Express server starts up.  This includes setting up the
 *     Firebase database and the socket.io functionality for the chat page.
 */

'use strict';

function configureServer(io) {
  const firebaseConfig = require('./firebase')();
  const socketIoConfig = require('./socket_io')(io);
}

module.exports = configureServer;
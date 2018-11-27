/**
 * @fileoverview Defines the server's socket.io event handlers for implementing
 *     the chat and audio page functionalities whenever the Express server
 *     starts up.
 */

'use strict';

function configureSocketIo(io) {
  // Defines event handlers on a socket connection
  io.on("connection", function(socket) {
    console.log("user connected");

    // Log every chat page message sent by a user and send it to other users
    socket.on("chat message", function(msg) {
      console.log("message: " + msg);
      io.emit("chat message", msg);
    });
    // Log when a socket disconnects from server
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
    // Broadcast 'audio message' event received at server to all sockets
    socket.on("audio message", function(freq) {
      socket.broadcast.emit("audio message", freq);
    });
  });
}

module.exports = configureSocketIo;
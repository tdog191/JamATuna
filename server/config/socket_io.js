'use strict';

function configureSocketIo(io) {
  io.on("connection", function(socket) {
    console.log("user connected");
    socket.on("chat message", function(msg) {
      console.log("message: " + msg);
      io.emit("chat message", msg);
    });
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
    socket.on("audio message", function(freq) {
      socket.broadcast.emit("audio message", freq);
    });
  });
}

module.exports = configureSocketIo;
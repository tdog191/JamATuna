function makeServer() {
  var express = require("express");
  var app = express();
  var http = require("http").createServer(app);
  var io = require("socket.io")(http);

  app.use("/public", express.static(__dirname + "/public"));

  app.get("/chat", function(req, res) {
    res.sendFile(__dirname + "/public/html/chat.html");
  });

  app.get("/audio", function(req, res) {
    res.sendFile(__dirname + "/public/html/audio_prototype.html");
  });

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

  http.listen(process.env.PORT || 3000, function() {
    console.log("server started");
  });

  return http;
}

module.exports = makeServer;

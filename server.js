function makeServer() {
  // Express and Socket IO setup
  var express = require("express");
  var app = express();
  var http = require("http").createServer(app);
  var io = require("socket.io")(http);

  // Expose public folder to the web
  app.use(express.static(__dirname + "/public"));

  // Home page API end point
  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/html/index.html");
  });

  // Socket IO chat and audio message event handlers
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

  // Start listing on the correct port
  http.listen(process.env.PORT || 3000, function() {
    console.log("server started");
  });

  return http;
}

module.exports = makeServer;

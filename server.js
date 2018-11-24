function makeServer() {
  const express = require('express');
  const app = express();
  const http = require('http').createServer(app);
  const io = require('socket.io')(http);

  const config = require('./server/config')(io);
  const api = require('./server/api')(app);

  app.use(express.static(__dirname + '/public'));

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/html/index.html');
  });

  http.listen(process.env.PORT || 3000, function() {
    console.log('server started');
  });

  return http;
}

module.exports = makeServer;

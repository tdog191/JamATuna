/**
 * @fileoverview Defines a function 'makeServer()' to configure and start up the
 *     Express server.  This function is executed every time the server starts
 *     up.
 * @returns {*} the server instance
 */

function makeServer() {
  const express = require('express');
  const app = express();
  const http = require('http').createServer(app);
  const io = require('socket.io')(http);

  // Configure the server and its API
  const config = require('./server/config')(io);
  const api = require('./server/api')(app);

  // Make all files in the '/public' directory publicly available to be served
  // to clients by the server
  app.use(express.static(__dirname + '/public'));

  // Defines GET request to retrieve the homepage of the website
  // ('/public/html/index.html')
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/html/index.html');
  });

  // Start listening on the correct port
  http.listen(process.env.PORT || 3000, function() {
    console.log('server started');
  });

  return http;
}

module.exports = makeServer;

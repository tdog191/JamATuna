/**
 * @fileoverview Defines the operations of sending and receiving messages within
 *     the chat webpage.
 */

'use strict';

/**
 * Emits the given message from the given user's socket and clear the user's
 * message box.
 */
function broadcastMessage(socket) {
  $('form').submit(function() {
    socket.emit('chat message', $('#username-box').val() + ": " + $('#message-box').val());
    $('#message-box').val('');
    return false;
  });
}

/**
 * Appends any message received on the given socket to the list of messages on
 * the chat webpage.
 */
function displayMessage(socket) {
  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });
}

/**
 * Defines the overall jquery functionality of the chat webpage: sending,
 * receiving, and displaying user messages.
 */
$(function() {
  var socket = io();
  broadcastMessage(socket);
  displayMessage(socket);
});
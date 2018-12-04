/**
 * @fileoverview Defines the operations of sending and receiving messages within
 *     the chat webpage.
 */

'use strict';

const baseUrl = window.location.origin;

/**
 * Defines the overall jquery functionality of the chat webpage: sending,
 * receiving, and displaying user messages within the jam room.
 */
window.onload = function() {
  const jamRoom = sessionStorage.getItem('jam_room');
  const socket = io.connect(baseUrl + '/chat');

  fetch(baseUrl + '/api/get_chat_history/' + jamRoom)
      .then(response => response.json())
      .then(data => {
        const chatHistory = data.chatHistory;

        // Display every message in the chat history
        for(let index=0; index<chatHistory.length; index++) {
          const username = chatHistory[index].username;
          const message = chatHistory[index].message;

          const displayMessage = `${username}: ${message}`;

          $('#messages').append($('<li>').text(displayMessage));
        }

        // Join the chat room and define the socket handlers
        socket.emit('joinChatRoom', jamRoom);
        broadcastMessage(socket, jamRoom);
        displayMessage(socket);
      });
};

/**
 * Emits the given message from the given user's socket and clears the user's
 * message box.
 */
function broadcastMessage(socket, jamRoom) {
  $('form').submit(function() {
    const username = $('#username-box').val();
    const message = $('#message-box').val();

    socket.emit('chatMessage', jamRoom, username, message);
    $('#message-box').val('');

    return false;
  });
}

/**
 * Appends any message received on the given socket to the list of messages on
 * the chat webpage.
 */
function displayMessage(socket) {
  socket.on('chatMessage', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });
}
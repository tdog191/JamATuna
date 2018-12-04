/**
 * @fileoverview Defines the server's socket.io event handlers for implementing
 *     the chat and audio page functionalities whenever the Express server
 *     starts up.
 */

'use strict';

/**
 * Defines all socket.io event handlers for sockets that connect to the '/chat'
 * namespace.
 *
 * When sockets connect to the '/chat' namespace, they join their jam room
 * within the namespace.  This allows sockets within a jam room to only send
 * chat messages to other sockets in the same jam room.
 *
 * @param io The server's socket.io instance to use to define event handlers
 */
function configureChatFunctionality(io, firebase) {
  io.of('/chat').on('connection', function(socket) {
    console.log('User connected to chat');

    // Make a socket join the chat in the provided jam room
    socket.on('joinChatRoom', function(jamRoom) {
      socket.join(jamRoom);

      console.log('User joined chat in jam room', jamRoom);
    });

    // Log every chat message sent by a user and send
    // it to the other users in the user's jam room
    socket.on('chatMessage', function(jamRoom, username, message) {
      console.log('Chat message received');
      console.log('Jam Room:', jamRoom);
      console.log('Username:', username);
      console.log('Message:', message);

      const displayMessage = `${username}: ${message}`;

      io.of('/chat').in(jamRoom).emit('chatMessage', displayMessage);

      // Acquire the current chat history of the jam
      // room to append the new chat message to it
      firebase.database().ref('/jam_rooms/' + jamRoom + '/chat_history/').once('value')
          .then(snapshot => {
            let chatHistory = snapshot.val();
            const chatMessage = {
              username: username,
              message: message,
            };

            // If a chat history already exists for this jam room, append the
            // new chat message to it.  Otherwise, create a new chat history
            // with the new chat message included.
            if(chatHistory) {
              chatHistory.push(chatMessage);
            } else {
              chatHistory = [chatMessage];
            }

            // Update the chat history of the jam room in Firebase
            firebase.database().ref('/jam_rooms/' + jamRoom).update({
              chat_history: chatHistory,
            });
          });
    });

    // Log when a socket disconnects from the server
    socket.on('disconnect', function() {
      console.log('User disconnected');
    });
  });
}

/**
 * Defines all socket.io event handlers for sockets that connect to the '/audio'
 * namespace.
 *
 * When sockets connect to the '/audio' namespace, they join their jam room
 * within the namespace.  This allows sockets within a jam room to only send
 * audio messages to other sockets in the same jam room.
 *
 * @param io The server's socket.io instance to use to define event handlers
 */
function configureAudioFunctionality(io) {
  io.of('/audio').on('connection', function(socket) {
    console.log('User connected to audio');

    // Make a socket join the audio page in the provided jam room
    socket.on('joinAudioRoom', function(jamRoom) {
      socket.join(jamRoom);

      console.log('User joined audio in jam room', jamRoom);
    });

    // Broadcast 'audio message' event received
    // at server to all sockets in the jam room
    socket.on('sendAudioMessage', function(jamRoom, freq) {
      console.log('Audio message received');
      console.log('Jam Room:', jamRoom);

      io.of('/audio').in(jamRoom).emit('playAudioMessage', freq);
    });

    // Log when a socket disconnects from the server
    socket.on('disconnect', function() {
      console.log('User disconnected');
    });
  });
}

/**
 * Defines all socket.io event handlers for socket connections
 *
 * @param io The server's socket.io instance to use to define event handlers
 */
function configureSocketIo(io) {
  const firebase = require('firebase');

  configureChatFunctionality(io, firebase);
  configureAudioFunctionality(io);
}

module.exports = configureSocketIo;
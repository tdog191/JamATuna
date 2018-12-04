/**
 * @fileoverview Defines jQuery functionality to update the title of the jam
 *     room page with the name of the jam room.
 */

'use strict';

window.onload = function() {
  const jamRoom = sessionStorage.getItem('jam_room');

  $('#page_header').text('Welcome to ' + jamRoom + '!');
};
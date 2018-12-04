/**
 * @fileoverview Defines jQuery functionality to update displayed profile
 *     picture depending on user selection in "Settings" tab.
 */

'use strict';

const baseUrl = window.location.origin;

window.onload = function() {
  const jamRoom = sessionStorage.getItem('jam_room');



  $('#page_header').text('Welcome to ' + jamRoom + '!');
};
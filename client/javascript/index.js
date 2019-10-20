/**
 * @fileoverview Defines page load handler to display the appropriate buttons
 *     on loading the homepage and jquery handlers to handle the functionality
 *     of the "Profile" and "Logout" buttons.
 */

"use strict";

const baseUrl = window.location.origin;

/**
 * A handler to check which of the 'Login', 'Logout', and 'Profile' buttons
 * should be hidden depending on whether or not a user is logged in.
 *
 * This handler is executed when the page has loaded.
 */
window.onload = function() {
  const username = sessionStorage.getItem("jamatuna_username");

  if (username) {
    $("#login").hide();
  } else {
    $("#profile").hide();
    $("#logout").hide();
  }
};

/**
 * Defines the overall jquery functionality of the homepage: preparing the
 * profile page of a logged-in user when the 'Profile' button is clicked and
 * logging out a user when the 'Logout' button is clicked.
 */
$(function() {
  $("#profile").on("click", function(event) {
    const username = sessionStorage.getItem("jamatuna_username");

    sessionStorage.setItem("profile_username", username);
    sessionStorage.setItem("arrived_from_homepage", true);
  });

  $("#logout").on("click", function() {
    sessionStorage.removeItem("jamatuna_username");
  });
});

const reddit_url =
  "http://www.reddit.com/submit?url=https://jamatuna.herokuapp.com&title=Check%20Out%20This%20Awesome%20New%20Music%20Game!";

const twitter_url =
  "https://twitter.com/intent/tweet?url=https://jamatuna.herokuapp.com&text=Check%20Out%20This%20Awesome%20New%20Music%20Game!";

const facebook_url =
  "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fjamatuna.herokuapp.com%2F&amp;src=sdkpreparse";

function popupWindow(url, title, win, w, h) {
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;

  switch (url) {
    case "reddit":
      url = reddit_url;
      break;
    case "twitter":
      url = twitter_url;
      break;
    case "facebook":
      url = facebook_url;
      break;
  }

  win.open(
    url,
    title,
    "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      y +
      ", left=" +
      x
  );
  return false;
}

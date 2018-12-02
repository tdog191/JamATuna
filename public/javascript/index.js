window.onload = function() {
  const username = sessionStorage.getItem('jamatuna_username');

  if(username) {
    $('#login').hide();
  } else {
    $('#logout').hide();
  }
};

$(function() {
  $('#logout').on('click', function() {
    sessionStorage.removeItem('jamatuna_username');
  });
});
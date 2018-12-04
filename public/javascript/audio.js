import Instrument from "./instrument.js";
import Drums from "./drums.js";

//=====================================================================================================================
// Globals
//=====================================================================================================================

var context;
var jamRoom;
var socket;
var pluck;
var bass;
var lead;
var piano;
var chord;
var drums;

//=====================================================================================================================
// Loading
//=====================================================================================================================

/**
 * Defines the actions to take when the browser window is opened.
 */
window.onload = function() {
  // Get audio context from browser
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  } catch (e) {
    alert("Web Audio API is not supported in this browser");
  }

  // Initialize socket io
  const baseUrl = window.location.origin;
  jamRoom = sessionStorage.getItem('jam_room');
  socket = io.connect(baseUrl + '/audio');

  socket.emit('joinAudioRoom', jamRoom);

  pluck = new Instrument(context, 0.2, {
    1: "/pluck/pluck-01.mp3",
    2: "/pluck/pluck-02.mp3",
    3: "/pluck/pluck-03.mp3",
    4: "/pluck/pluck-04.mp3",
    5: "/pluck/pluck-05.mp3",
    6: "/pluck/pluck-06.mp3",
    7: "/pluck/pluck-07.mp3",
    8: "/pluck/pluck-08.mp3",
    9: "/pluck/pluck-09.mp3",
    10: "/pluck/pluck-10.mp3",
    11: "/pluck/pluck-11.mp3"
  });

  bass = new Instrument(context, 0.2, {
    1: "/bass/bass-01.mp3",
    2: "/bass/bass-02.mp3",
    3: "/bass/bass-03.mp3",
    4: "/bass/bass-04.mp3",
    5: "/bass/bass-05.mp3",
    6: "/bass/bass-06.mp3",
    7: "/bass/bass-07.mp3",
    8: "/bass/bass-08.mp3",
    9: "/bass/bass-09.mp3",
    10: "/bass/bass-10.mp3",
    11: "/bass/bass-11.mp3"
  });

  lead = new Instrument(context, 0.2, {
    1: "/lead/lead-01.mp3",
    2: "/lead/lead-02.mp3",
    3: "/lead/lead-03.mp3",
    4: "/lead/lead-04.mp3",
    5: "/lead/lead-05.mp3",
    6: "/lead/lead-06.mp3",
    7: "/lead/lead-07.mp3",
    8: "/lead/lead-08.mp3",
    9: "/lead/lead-09.mp3",
    10: "/lead/lead-10.mp3",
    11: "/lead/lead-11.mp3"
  });

  piano = new Instrument(context, 0.2, {
    1: "/piano/piano-01.mp3",
    2: "/piano/piano-02.mp3",
    3: "/piano/piano-03.mp3",
    4: "/piano/piano-04.mp3",
    5: "/piano/piano-05.mp3",
    6: "/piano/piano-06.mp3",
    7: "/piano/piano-07.mp3",
    8: "/piano/piano-08.mp3",
    9: "/piano/piano-09.mp3",
    10: "/piano/piano-10.mp3",
    11: "/piano/piano-11.mp3"
  });

  chord = new Instrument(context, 0.2, {
    1: "/chord/chord-01.mp3",
    2: "/chord/chord-02.mp3",
    3: "/chord/chord-03.mp3",
    4: "/chord/chord-04.mp3",
    5: "/chord/chord-05.mp3",
    6: "/chord/chord-06.mp3",
    7: "/chord/chord-07.mp3",
    8: "/chord/chord-08.mp3",
    9: "/chord/chord-09.mp3",
    10: "/chord/chord-10.mp3",
    11: "/chord/chord-11.mp3"
  });

  drums = new Drums(context);

  // Load all audio files from the server then fade out the overlay
  Promise.all([
    pluck.loadAllFiles(),
    bass.loadAllFiles(),
    lead.loadAllFiles(),
    piano.loadAllFiles(),
    chord.loadAllFiles(),
    drums.loadAndPlayAllFiles()
  ]).then(() => {
    $("#overlay").fadeOut("slow");
  });
};

//=====================================================================================================================
// jQuery
//=====================================================================================================================

$(function() {
  // Set note button event handlers
  $("#pluck").on("click", ".btn", function() {
    var freq = $(this).attr("id");
    socket.emit("sendAudioMessage", jamRoom, { instrument: "pluck", freq: freq });
    pluck.updateFrequency($(this).attr("id"));
    pluck.playSound();
  });

  $("#bass").on("click", ".btn", function() {
    var freq = $(this).attr("id");
    socket.emit("sendAudioMessage", jamRoom, { instrument: "bass", freq: freq });
    bass.updateFrequency($(this).attr("id"));
    bass.playSound();
  });

  $("#chord").on("click", ".btn", function() {
    var freq = $(this).attr("id");
    socket.emit("sendAudioMessage", jamRoom, { instrument: "chord", freq: freq });
    chord.updateFrequency($(this).attr("id"));
    chord.playSound();
  });

  $("#lead").on("click", ".btn", function() {
    var freq = $(this).attr("id");
    socket.emit("sendAudioMessage", jamRoom, { instrument: "lead", freq: freq });
    lead.updateFrequency($(this).attr("id"));
    lead.playSound();
  });

  $("#piano").on("click", ".btn", function() {
    var freq = $(this).attr("id");
    socket.emit("sendAudioMessage", jamRoom, { instrument: "piano", freq: freq });
    piano.updateFrequency($(this).attr("id"));
    piano.playSound();
  });

  $("#hats").on("click", function() {
    drums.toggleLayer(3);
  });

  $("#congas").on("click", function() {
    drums.toggleLayer(2);
  });

  $("#shakers").on("click", function() {
    drums.toggleLayer(4);
  });

  // Set pan slider event handlers
  $("#pluck-pan").slider({
    formatter: function(value) {
      pluck.updatePanning(value);
    }
  });

  $("#bass-pan").slider({
    formatter: function(value) {
      bass.updatePanning(value);
    }
  });

  $("#chord-pan").slider({
    formatter: function(value) {
      chord.updatePanning(value);
    }
  });

  $("#piano-pan").slider({
    formatter: function(value) {
      piano.updatePanning(value);
    }
  });

  $("#lead-pan").slider({
    formatter: function(value) {
      lead.updatePanning(value);
    }
  });

  // Set gain slider event handlers
  $("#pluck-gain").slider({
    formatter: function(value) {
      pluck.updateGain(value);
    }
  });

  $("#bass-gain").slider({
    formatter: function(value) {
      bass.updateGain(value);
    }
  });

  $("#chord-gain").slider({
    formatter: function(value) {
      chord.updateGain(value);
    }
  });

  $("#piano-gain").slider({
    formatter: function(value) {
      piano.updateGain(value);
    }
  });

  $("#lead-gain").slider({
    formatter: function(value) {
      lead.updateGain(value);
    }
  });

  // Handle audio messages received from the server
  socket.on("playAudioMessage", function(data) {
    switch (data["instrument"]) {
      case "pluck":
        pluck.updateFrequency(data["freq"]);
        pluck.playSound();
        break;
      case "bass":
        bass.updateFrequency(data["freq"]);
        bass.playSound();
        break;
      case "chord":
        chord.updateFrequency(data["freq"]);
        chord.playSound();
        break;
      case "lead":
        lead.updateFrequency(data["freq"]);
        lead.playSound();
        break;
      case "piano":
        piano.updateFrequency(data["freq"]);
        piano.playSound();
        break;
    }
  });
});

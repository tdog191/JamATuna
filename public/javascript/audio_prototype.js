import Instrument from "./instrument.js";

var context;
var synth;

window.onload = function() {
  context = new AudioContext();
  synth = new Instrument(context, 0.5, {
    1: "/synth/synth-01.mp3",
    2: "/synth/synth-02.mp3",
    3: "/synth/synth-03.mp3",
    4: "/synth/synth-04.mp3",
    5: "/synth/synth-05.mp3",
    6: "/synth/synth-06.mp3",
    7: "/synth/synth-07.mp3",
    8: "/synth/synth-08.mp3",
    9: "/synth/synth-09.mp3",
    10: "/synth/synth-10.mp3",
    11: "/synth/synth-11.mp3"
  });
  synth.loadAllFiles();
};

$(function() {
  var socket = io();
  $(".btn-group").on("click", ".btn", function() {
    var freq = $(this).attr("id");
    socket.emit("audio message", freq);
    synth.updateFrequency($(this).attr("id"));
    synth.playSound();
  });
  socket.on("audio message", function(freq) {
    synth.updateFrequency(freq);
    synth.playSound();
  });
});

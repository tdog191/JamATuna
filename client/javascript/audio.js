import Instrument from "./instrument.js";
import Drums from "./drums.js";
import LogScale from "./vendor/log_scale.js";

//=====================================================================================================================
// Globals
//=====================================================================================================================

// Back-end variables
var baseUrl = window.location.origin;
var audioContext;
var jamRoom;
var socket = io.connect(baseUrl + "/audio");
var instruments = {};
var logScale = new LogScale(0.0, 1.0);

// Konva canvas variables
var colors = ["#B25959", "#B159B2", "#7F59B2", "#5968B2", "#59A0B2"];
var instrumentNames = ["pluck", "bass", "lead", "piano", "chord"];
var buttons = {};
var width = 1100;
var height = 440;
var numRows = 11;
var numCols = 5;
var maxBrightness = 0.5;
var brightness = maxBrightness;
var buttonWidth = width / numCols;
var buttonHeight = height / numRows;
var mousePressed = false;
var hoveredButtonData = {};
var elapsedTime = 0;
var waitTime = 125;
var mouseInside = false;

//=====================================================================================================================
// Loading
//=====================================================================================================================

window.onload = function() {
  // Get audio context from browser
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
  } catch (e) {
    alert("Web Audio API is not supported in this browser");
  }

  // Join the jam room
  jamRoom = sessionStorage.getItem("jam_room");
  socket.emit("joinAudioRoom", jamRoom);

  document.getElementById("title").innerHTML =
    jamRoom + " / " + document.getElementById("title").innerHTML;

  // Set up instruments
  instruments = {
    pluck: new Instrument(audioContext, 0.2, {
      0: "/pluck/pluck-01.mp3",
      1: "/pluck/pluck-02.mp3",
      2: "/pluck/pluck-03.mp3",
      3: "/pluck/pluck-04.mp3",
      4: "/pluck/pluck-05.mp3",
      5: "/pluck/pluck-06.mp3",
      6: "/pluck/pluck-07.mp3",
      7: "/pluck/pluck-08.mp3",
      8: "/pluck/pluck-09.mp3",
      9: "/pluck/pluck-10.mp3",
      10: "/pluck/pluck-11.mp3"
    }),
    bass: new Instrument(audioContext, 0.2, {
      0: "/bass/bass-01.mp3",
      1: "/bass/bass-02.mp3",
      2: "/bass/bass-03.mp3",
      3: "/bass/bass-04.mp3",
      4: "/bass/bass-05.mp3",
      5: "/bass/bass-06.mp3",
      6: "/bass/bass-07.mp3",
      7: "/bass/bass-08.mp3",
      8: "/bass/bass-09.mp3",
      9: "/bass/bass-10.mp3",
      10: "/bass/bass-11.mp3"
    }),
    lead: new Instrument(audioContext, 0.2, {
      0: "/lead/lead-01.mp3",
      1: "/lead/lead-02.mp3",
      2: "/lead/lead-03.mp3",
      3: "/lead/lead-04.mp3",
      4: "/lead/lead-05.mp3",
      5: "/lead/lead-06.mp3",
      6: "/lead/lead-07.mp3",
      7: "/lead/lead-08.mp3",
      8: "/lead/lead-09.mp3",
      9: "/lead/lead-10.mp3",
      10: "/lead/lead-11.mp3"
    }),
    piano: new Instrument(audioContext, 0.2, {
      0: "/piano/piano-01.mp3",
      1: "/piano/piano-02.mp3",
      2: "/piano/piano-03.mp3",
      3: "/piano/piano-04.mp3",
      4: "/piano/piano-05.mp3",
      5: "/piano/piano-06.mp3",
      6: "/piano/piano-07.mp3",
      7: "/piano/piano-08.mp3",
      8: "/piano/piano-09.mp3",
      9: "/piano/piano-10.mp3",
      10: "/piano/piano-11.mp3"
    }),
    chord: new Instrument(audioContext, 0.2, {
      0: "/chord/chord-01.mp3",
      1: "/chord/chord-02.mp3",
      2: "/chord/chord-03.mp3",
      3: "/chord/chord-04.mp3",
      4: "/chord/chord-05.mp3",
      5: "/chord/chord-06.mp3",
      6: "/chord/chord-07.mp3",
      7: "/chord/chord-08.mp3",
      8: "/chord/chord-09.mp3",
      9: "/chord/chord-10.mp3",
      10: "/chord/chord-11.mp3"
    }),
    drums: new Drums(audioContext)
  };

  // Load all audio files from the server then fade out the overlay
  Promise.all([
    instruments.pluck.loadAllFiles(),
    instruments.bass.loadAllFiles(),
    instruments.lead.loadAllFiles(),
    instruments.piano.loadAllFiles(),
    instruments.chord.loadAllFiles(),
    instruments.drums.loadAndPlayAllFiles()
  ]).then(() => {
    $("#overlay").fadeOut("slow");
  });
};

//=====================================================================================================================
// Konva Canvas
//=====================================================================================================================

// Create canvas stage
var stage = new Konva.Stage({
  container: "container",
  width: width,
  height: height,
  listening: true
});

// Handle mouse cursor entering the stage
stage.on("mouseenter", function() {
  mouseInside = true;
  stage.container().style.cursor = "pointer";
});

// Handle mouse cursor leaving the stage
stage.on("mouseleave", function() {
  mouseInside = false;
  stage.container().style.cursor = "default";
});

// Create a Konva layer to add objects to
var layer = new Konva.Layer();

// Create grid of rectangular buttons
for (var row = 0; row < numRows; row++) {
  for (var col = 0; col < numCols; col++) {
    var button = new Konva.Rect({
      x: buttonWidth * col,
      y: buttonHeight * row,
      width: buttonWidth,
      height: buttonHeight,
      fill: colors[col],
      listening: true,
      name: JSON.stringify({
        brightness: brightness,
        freq: numRows - row - 1,
        instrument: instrumentNames[col]
      })
    });

    // Turn on caching and brightness filter
    button.cache();
    button.filters([Konva.Filters.Brighten]);
    button.brightness(brightness);

    // Handle mouse over
    button.on("mouseover", function() {
      var data = JSON.parse(this.name());

      // Set global data
      hoveredButtonData = {
        freq: data.freq,
        instrument: data.instrument
      };

      // Darken button on mouse over
      var tween = new Konva.Tween({
        node: this,
        duration: 0.1,
        brightness: data.brightness - 0.15
      });

      tween.play();
    });

    // Handle mouse out
    button.on("mouseout", function() {
      var data = JSON.parse(this.name());

      // Brighten button back to default
      var tween = new Konva.Tween({
        node: this,
        duration: 0.1,
        brightness: data.brightness
      });

      tween.play();
    });

    // Handle mouse down
    button.on("mousedown", function() {
      mousePressed = true;
    });

    // Handle mouse up
    button.on("mouseup", function() {
      mousePressed = false;
    });

    // Add button to layer and save to global data
    layer.add(button);
    buttons[instrumentNames[col] + "-" + (numRows - row - 1)] = button;
  }

  // Update brightness for each row
  brightness -= maxBrightness / 11;
}

// Add layer to the stage
stage.add(layer);

// Create animation loop
var animation = new Konva.Animation(function(frame) {
  // Allow events to be created every waitTime ms
  if (mousePressed && mouseInside && elapsedTime > waitTime) {
    elapsedTime = 0;
    playSound(hoveredButtonData, true);
  }

  elapsedTime += frame.timeDiff;
});

// Start animation loop
animation.start();

// Handle audio messages received from the server
socket.on("playAudioMessage", function(data) {
  // Only play audio message from other sockets
  if (socket.id != data.id) {
    // Play audio message
    playSound(data, false);

    // Get corresponding button
    var button = buttons[data.instrument + "-" + data.freq];
    var data = JSON.parse(button.name());

    // Make the button brightness pulse
    var tweenIn = new Konva.Tween({
      node: button,
      duration: 0.1,
      brightness: data.brightness + 0.15,
      onFinish: function() {
        var tweenOut = new Konva.Tween({
          node: button,
          duration: 0.1,
          brightness: data.brightness
        });
        tweenOut.play();
      }
    });

    tweenIn.play();
  }
});

/**
 * Plays an audio message. The sound will be quantized to the beat and the
 * audio message will be sent to the server if sending is true and the
 * message is successful played by the instrument.
 *
 * @param {Object} data
 * @param {Boolean} sending
 */
function playSound(data, sending) {
  instruments[data.instrument].updateFrequency(data.freq);
  var successful = instruments[data.instrument].playSound();

  if (successful && sending) {
    socket.emit("sendAudioMessage", jamRoom, data);
  }
}

//=====================================================================================================================
// JQuery
//=====================================================================================================================

$(function($) {
  // Handle gain knobs
  $(".gain").knob({
    min: 0.0,
    max: 1.0,
    step: 0.001,
    width: 70,
    thickness: 0.3,
    angleOffset: -125,
    angleArc: 250,
    fgColor: "#444444",
    bgColor: "#FFFFFF",
    rotation: "clockwise",
    displayInput: false,
    displayPrevious: true,
    change: function(value) {
      var instrument = this.$.data("name");
      var scaledValue = logScale.logarithmicToLinear(value);
      instruments[instrument].updateGain(scaledValue);
    }
  });

  // Handle pan knobs
  $(".pan").knob({
    min: -1.0,
    max: 1.0,
    step: 0.001,
    width: 70,
    cursor: 15.0,
    thickness: 0.3,
    angleOffset: -125,
    angleArc: 250,
    fgColor: "#444444",
    bgColor: "#FFFFFF",
    rotation: "clockwise",
    displayInput: false,
    displayPrevious: true,
    change: function(value) {
      var instrument = this.$.data("name");
      instruments[instrument].updatePanning(value);
    }
  });

  // Handle hats toggle
  $("#hats").on("change", function() {
    instruments.drums.toggleLayer(3);
  });

  // Handle shakers toggle
  $("#shakers").on("change", function() {
    instruments.drums.toggleLayer(4);
  });

  // Handle congas toggle
  $("#congas").on("change", function() {
    instruments.drums.toggleLayer(2);
  });
});

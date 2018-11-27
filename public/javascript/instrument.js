var baseUrl = window.location.origin;

/**
 * Creates an Instrument. This instrument provides a means for changing different
 * parameters such as frequency, gain, and pan.
 * @param {Web Audio API Audio Context} context
 * @param {Maximum amplitude} gain
 * @param {Audio files} audioFiles
 */
function Instrument(context, gain, audioFiles) {
  this.audioFiles = audioFiles;
  this.context = context;
  this.audioBuffers = {};
  this.frequency = 1;
  this.maxGain = gain;
  this.gain = 1;
  this.pan = 0;
}

Instrument.prototype = {
  constructor: Instrument,

  /**
   * Loads all audio files. Audio files are first fetched from the server,
   * then decoded and saved in local data.
   */
  loadAllFiles: function() {
    // Create a request to the server to fetch the audio files
    Promise.all(
      Object.keys(this.audioFiles).map(key => {
        return fetch(baseUrl + "/audio" + this.audioFiles[key]).then(response => response.arrayBuffer());
      })
    )
      // Decode the audio data
      .then(arrayBuffers => {
        return Promise.all(
          arrayBuffers.map(arrayBuffer => {
            return this.context.decodeAudioData(arrayBuffer);
          })
        );
      })
      // Save the data locally
      .then(decodedBuffers => {
        for (var i = 1; i <= Object.keys(this.audioFiles).length; i++) {
          this.audioBuffers[i] = decodedBuffers[i - 1];
        }
      })
      .then(() => {
        return Promise.resolve();
      })
      .catch(e => {
        console.error(e);
      });
  },

  /**
   * Updates the frequency (or note) of the instrument.
   * @param {Frequency key} row
   */
  updateFrequency(row) {
    this.frequency = row;
  },

  /**
   * Updates the panning value of the instrument.
   * @param {Panning value} value
   */
  updatePanning(value) {
    this.pan = value;
  },

  /**
   * Updates the gain value of the instrument.
   * @param {Gain value} value
   */
  updateGain(value) {
    this.gain = value;
  },

  /**
   * Plays the currently selected frequency (note) with the current gain
   * and pan.
   */
  playSound() {
    // Quantize start time
    var now = this.context.currentTime;
    var timeToPlay = (Math.floor(now / 0.25) + 1) * 0.25;

    // Create audio source
    var source = this.context.createBufferSource();
    source.buffer = this.audioBuffers[this.frequency];

    // Create gain node to handle volume
    var gainNode = this.context.createGain();
    gainNode.gain.value = 0.0;
    gainNode.gain.setTargetAtTime(this.maxGain * this.gain, timeToPlay, 0.01);
    gainNode.gain.setTargetAtTime(0.0, timeToPlay + 2.0, 0.1);

    // Create pan node to handle panning
    var panNode = this.context.createStereoPanner();
    panNode.pan.value = this.pan;

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(this.context.destination);

    // Play sound
    source.start(timeToPlay);
  }
};

export default Instrument;

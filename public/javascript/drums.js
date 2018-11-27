var baseUrl = window.location.origin;

/**
 * Creates a drums instrument. This instrument loops multiple drum loops and then
 * provides a means to toggle on and off the different loops.
 * @param {Web Audio API Audio Context} context
 */
function Drums(context) {
  this.audioFiles = {
    1: "/drums/drums_base.wav",
    2: "/drums/drums_congas.wav",
    3: "/drums/drums_hats.wav",
    4: "/drums/drums_shakers.wav"
  };
  this.gains = {
    1: 0.2,
    2: 0.1,
    3: 0.1,
    4: 0.1
  };
  this.audioBuffers = {};
  this.context = context;
  this.gainNodes = {};
}

Drums.prototype = {
  constructor: Drums,

  /**
   * Loads and plays all audio files. Audio files are first fetched from the server,
   * then decoded and saved in local data before finally all being played at once.
   */
  loadAndPlayAllFiles: function() {
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
      // Play each of the audio files
      .then(() => {
        Object.keys(this.audioBuffers).forEach(key => {
          // Calculate start time
          var now = this.context.currentTime;
          var timeToPlay = (Math.floor(now / 0.25) + 1) * 0.25;

          // Create source node and set audio to loop
          var source = this.context.createBufferSource();
          source.buffer = this.audioBuffers[key];
          source.loop = true;

          // Create gain node to handle volume
          var gainNode = this.context.createGain();
          gainNode.gain.value = this.gains[key];

          // Connect nodes
          source.connect(gainNode);
          gainNode.connect(this.context.destination);

          // Play audio and save gain node for later
          source.start(timeToPlay);
          this.gainNodes[key] = gainNode;
        });
        return Promise.resolve();
      })
      .catch(e => {
        console.error(e);
      });
  },

  /**
   * Toggles the layer on or off depending on the previous state.
   * @param {Layer number} layer
   */
  toggleLayer: function(layer) {
    var now = this.context.currentTime;
    var timeToPlay = (Math.floor(now / 0.25) + 1) * 0.25;
    if (this.gainNodes[layer].gain.value != 0) {
      this.gainNodes[layer].gain.setTargetAtTime(0.0, timeToPlay, 0.1);
    } else {
      this.gainNodes[layer].gain.setTargetAtTime(this.gains[layer], timeToPlay, 0.1);
    }
  }
};

export default Drums;

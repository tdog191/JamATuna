var baseUrl = window.location.origin;

function Instrument(context, gain, audioFiles) {
  this.audioFiles = audioFiles;
  this.context = context;
  this.audioBuffers = {};
  this.frequency = 1;
  this.gain = gain;
}

Instrument.prototype = {
  constructor: Instrument,
  loadAllFiles: function() {
    Promise.all(
      Object.keys(this.audioFiles).map(key => {
        return fetch(baseUrl + "/public/audio" + this.audioFiles[key])
          .then(response => response.arrayBuffer())
          .then(buffer => {
            this.context.decodeAudioData(
              buffer,
              decoded => {
                this.audioBuffers[key] = decoded;
              },
              e => {
                console.error(e);
              }
            );
          });
      })
    )
      .then(() => {
        alert("Audio files loaded!");
      })
      .catch(e => {
        console.error(e);
      });
  },
  updateFrequency(row) {
    this.frequency = row;
  },
  playSound() {
    var now = this.context.currentTime;
    var timeToPlay = (Math.floor(now / 0.125) + 1) * 0.125;
    var gainNode = this.context.createGain();
    var source = this.context.createBufferSource();
    source.buffer = this.audioBuffers[this.frequency];
    gainNode.gain.setTargetAtTime(this.gain, timeToPlay, 0.01);
    gainNode.gain.setTargetAtTime(0.0, timeToPlay + 2.0, 0.1);
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    source.start(timeToPlay);
  }
};

export default Instrument;

export default class Note {

    constructor(frequency, audioContext, waveform, volume, distortion, sustain){
        this.frequency = frequency;
        this.audioContext = audioContext;
        this.waveform = waveform;
        this.volume = volume / 100;
        this.distortionCurve = distortion;
        this.sustain = sustain;

        this.osc = audioContext.createOscillator();
        this.gainNode = audioContext.createGain();
        this.dist = audioContext.createWaveShaper();
        
        this.oscillators = [];
    }
    
    start() {
        this.osc.frequency.value = this.frequency;
        this.gainNode.gain.value = this.volume;
        this.dist.curve = makeDistortionCurve(parseInt(this.distortionCurve));

        if (this.waveform === 'custom') {

            var real = new Float32Array([-1, -0.5, 0, 0.5, 1]);
            var imag = new Float32Array([1, 0.5, 0, -0.5, -1]);
     
            var wave = this.audioContext.createPeriodicWave(real, imag);         
            this.osc.setPeriodicWave(wave);
        } else {
            this.osc.type = this.waveform;   
        }

        
        this.osc.connect(this.dist);
        this.dist.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination)
        this.osc.start(0);
        this.oscillators.push(this.osc);
    }

    stop() {
        this.oscillators.forEach(osc => { 
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + (this.sustain / 1000));
            osc.stop(this.audioContext.currentTime + (this.sustain / 1000));
            setTimeout(() => {
                osc.disconnect();
            }, (this.sustain + 100));
        })
    }
};

// http://stackoverflow.com/a/22313408/1090298
function makeDistortionCurve( amount ) {
    var k = typeof amount === 'number' ? amount : 0,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
}
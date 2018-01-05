export default class Note {

    constructor(frequency, audioContext, waveform, volume, distortion, sustain, accent){
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
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
            osc.stop(this.audioContext.currentTime + 0.2);
            setTimeout(() => {
                osc.disconnect();
            }, 300);
        })
    }
};
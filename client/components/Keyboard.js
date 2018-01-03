import React, {Component} from 'react';

const keys = {
    gKey: {
        element: document.getElementById('g'),
        code: 65,
        frequency: 196
    },
    gSharpKey: {
        element: document.getElementById('g-sharp'),
        code: 87,
        frequency: 207.7
    },
    aKey: {
        element: document.getElementById('a'),
        code: 83,
        frequency: 220
    },
    aSharpKey: {
        element: document.getElementById('a-sharp'),
        code: 69,
        frequency: 233.1
    },
    bKey: {
        element: document.getElementById('b'),
        code: 68,
        frequency: 246.9
    },
    cKey: {
        element: document.getElementById('c'),
        code: 70,
        frequency: 261.6
    },
    cSharpKey: {
        element: document.getElementById('c-sharp'),
        code: 84,
        frequency: 277.2
    },
    dKey: {
        element: document.getElementById('d'),
        code: 71,
        frequency: 293.7
    },
    dSharpKey: {
        element: document.getElementById('d-sharp'),
        code: 89,
        frequency: 311.1
    },
    eKey: {
        element: document.getElementById('e'),
        code: 72,
        frequency: 329.6
    },
    fKey: {
        element: document.getElementById('f'),
        code: 74,
        frequency: 349.2
    },
    fSharpKey: {
        element: document.getElementById('f-sharp'),
        code: 73,
        frequency: 370
    },
    highGKey: {
        element: document.getElementById('high-g'),
        code: 75,
        frequency: 392
    }
};

class Note { 
    constructor(frequency, audioContext){
        this.frequency = frequency;
        this.audioContext = audioContext;
        this.waveform = 'sine';
        this.osc = audioContext.createOscillator();
        this.gainNode = audioContext.createGain();
        this.oscillators = [];
    }

    start() {
        
        this.osc.frequency.value = this.frequency;
        this.gainNode.gain.value = 1;

        if (this.waveform === 'custom') {

            var real = new Float32Array([-1, -0.5, 0, 0.5, 1]);
            var imag = new Float32Array([1, 0.5, 0, -0.5, -1]);
     
            var wave = this.audioContext.createPeriodicWave(real, imag);         
            this.osc.setPeriodicWave(wave);
        } else {
            this.osc.type = this.waveform;            
        }

        
        this.osc.connect(this.gainNode);
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

export default class Keyboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioContext: new AudioContext(),
            keys: keys
        }
        this.activeNotes = {};
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this); 
        this.checkChord = this.checkChord.bind(this);
    }

    handleKeyDown(e) {
        let keyboard = document.getElementById('keyboard');
        let code = e.keyCode ? e.keyCode : e.which;
        
        if (!this.activeNotes[code] && !keyboard.classList.contains('hidden')) {
            let note = new Note(this.frequency, this.audioContext);
            this.activeNotes[code] = note;
            this.keys.element.classList.add('active');
            note.start();
        }
        
        this.checkChord();    
    }

    handleKeyUp(e) {
        let code = e.keyCode ? e.keyCode : e.which;
        if (this.activeNotes) {
            this.activeNotes[code].stop();
            this.activeNotes[code] = null;
            this.state.keys.element.classList.remove('active');
        }
    }

    checkChord() {
        var count = 0;
        var noteFrequencies = [];
        Object.keys(this.activeNotes).forEach(key => {
            if (this.activeNotes[key]) {
                count++;
                noteFrequencies.push(this.activeNotes[key].frequency);
            }
        })
        if (count === 3) {
            noteFrequencies.sort();
            let freq1 = noteFrequencies[0];
            let freq2 = noteFrequencies[1];
            let freq3 = noteFrequencies[2];        
            changeBackground(freq1, freq2, freq3);
        }

        function changeBackground(freq1, freq2, freq3) {
            var body = document.getElementById('body');
            if (major(freq1, freq2, freq3)) {
                body.classList = 'container';
                body.classList.add('orange');
            } else if (minor(freq1, freq2, freq3)) {
                body.classList = 'container';
                body.classList.add('blue');
            } else {
                body.classList = 'container';
                body.classList.add('grey');
            }
        }

        function major(freq1, freq2, freq3) {
            return (Math.abs((freq2 / 5) - (freq1 / 4)) < 1
                 && Math.abs((freq3 / 6) - (freq1 / 4)) < 1)
                || (Math.abs((freq2 / 6) - (freq1 / 5)) < 1
                 && Math.abs((freq3 / 8) - (freq1 / 5)) < 1)
                || (Math.abs((freq2 / 4) - (freq1 / 3)) < 1
                 && Math.abs((freq3 / 5) - (freq1 / 3)) < 1)
        }
        
        function minor(freq1, freq2, freq3) {
            return (Math.abs((freq2 / 12) - (freq1 / 10)) < 1
                 && Math.abs((freq3 / 15) - (freq1 / 10)) < 1)
                || (Math.abs((freq2 / 15) - (freq1 / 12)) < 1
                 && Math.abs((freq3 / 20) - (freq1 / 12)) < 1)
                || (Math.abs((freq2 / 20) - (freq1 / 15)) < 1
                 && Math.abs((freq3 / 24) - (freq1 / 15)) < 1)
        }
    }

    render() {
        return (
            <div id="main" className="container-fluid" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
                <h1>Party</h1>
                <div id="functionality">
                    <div id="waveform-container">
                        <div id="wave-img" />
                        <select id="waveform">
                            <option value="sine">sine</option>
                            <option value="square">square</option>
                            <option value="triangle">triangle</option>
                            <option value="sawtooth">sawtooth</option>
                            <option value="custom">custom</option>
                        </select>
                        <label>Distortion: </label>
                        <input id="distortion" type="range" className="slider" min="0" max="100" defaultValue="0" />
                        <label>Octave: </label>
                        <input id="octave" type="range" className="slider" min="0" max="3" defaultValue="0" />
                    </div>
                    <br />
                    <button id="open-keyboard-btn" className="btn btn-primary">Open Keyboard</button>
                    <div id="keyboard">
                        <div id="sharps">
                            <button id="g-sharp" className="sharp-note">g#</button>
                            <button id="a-sharp" className="sharp-note">a#</button>
                            <button id="b-sharp" className="fake-sharp-note" />
                            <button id="c-sharp" className="sharp-note">c#</button>
                            <button id="d-sharp" className="sharp-note">d#</button>
                            <button id="e-sharp" className="fake-sharp-note" />
                            <button id="f-sharp" className="sharp-note">f#</button>
                        </div>
                        <div id="regulars">
                            <button id="g" className="regular-note">G3</button>
                            <button id="a" className="regular-note"></button>
                            <button id="b" className="regular-note"></button>
                            <button id="c" className="regular-note"></button>
                            <button id="d" className="regular-note"></button>
                            <button id="e" className="regular-note"></button>
                            <button id="f" className="regular-note"></button>
                            <button id="high-g" className="regular-note"></button>
                        </div>
                    </div>
                    <button id="open-machine-btn" className="btn btn-primary">Open Synth Machine</button>
                    <table id="machine-table" className="hidden"></table>
                </div>
            </div>
        )
    }
}

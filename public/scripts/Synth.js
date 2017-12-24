var waveformSelect = document.getElementById('waveform');
var waveImg = document.getElementById('wave-img');

var distortion = document.getElementById('distortion');
var octave = document.getElementById('octave');

function setWaveImg () {
    waveImg.classList = '';
    if (waveformSelect.value !== 'custom') {
        waveImg.classList.add(waveformSelect.value);
    }
}
setWaveImg();

waveformSelect.addEventListener('change', e => {
    setWaveImg();
})

var openKeyboard = document.getElementById('open-keyboard-btn');
var keyboard = document.getElementById('keyboard');
openKeyboard.addEventListener('click', () => {
    keyboard.classList.toggle('hidden');
    if (openKeyboard.innerText === 'Open Keyboard') openKeyboard.innerText = 'Close Keyboard';
    else openKeyboard.innerText = 'Open Keyboard';
})

var gKey = document.getElementById('g');
var gSharpKey = document.getElementById('g-sharp');
var aKey = document.getElementById('a');
var aSharpKey = document.getElementById('a-sharp');
var bKey = document.getElementById('b');
var cKey = document.getElementById('c');
var cSharpKey = document.getElementById('c-sharp');
var dKey = document.getElementById('d');
var dSharpKey = document.getElementById('d-sharp');
var eKey = document.getElementById('e');
var fKey = document.getElementById('f');
var fSharpKey = document.getElementById('f-sharp');
var highGKey = document.getElementById('high-g');

var keyCodeCombo = {
    65: gKey,
    87: gSharpKey,
    83: aKey,
    69: aSharpKey,
    68: bKey,
    70: cKey,
    84: cSharpKey,
    71: dKey,
    89: dSharpKey,
    72: eKey,
    74: fKey,
    73: fSharpKey,
    75: highGKey
}

var audioContext = new AudioContext();

class Note { 
    constructor(frequency){
        this.frequency = frequency * Math.pow(2, (parseInt(octave.value)));
        this.waveform = waveformSelect.value;
        this.osc = audioContext.createOscillator();
        this.dist = audioContext.createWaveShaper();
        this.gainNode = audioContext.createGain();
        this.oscillators = [];
    }

    start() {
        
        this.osc.frequency.value = this.frequency;
        this.dist.curve = makeDistortionCurve(parseInt(distortion.value));
        this.gainNode.gain.value = 1;

        if (this.waveform === 'custom') {

            var real = new Float32Array([-1, -0.5, 0, 0.5, 1]);
            var imag = new Float32Array([1, 0.5, 0, -0.5, -1]);
     
            var wave = audioContext.createPeriodicWave(real, imag);         
            this.osc.setPeriodicWave(wave);
        } else {
            this.osc.type = this.waveform;            
        }

        
        this.osc.connect(this.dist);
        this.dist.connect(this.gainNode);
        this.gainNode.connect(audioContext.destination)
        this.osc.start(0);
        this.oscillators.push(this.osc);
    }

    stop() {
        this.oscillators.forEach(osc => {          
            this.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
            osc.stop(audioContext.currentTime + 0.2);
            setTimeout(() => {
                osc.disconnect();
            }, 300);
        })
    }
};

let activeNotes = {};

document.addEventListener('keydown', e => {
    let code = e.keyCode ? e.keyCode : e.which;
    let waveform = waveformSelect.value;
    let frequency;
    switch (code) {
        case 65: //a key, g 
            frequency = 196;
            break;
        case 87: //w key, g sharp
            frequency = 207.7;
            break;
        case 83: //s key, a
            frequency = 220;
            break;
        case 69: //e key, a sharp
            frequency = 233.1;
            break;
        case 68: //d key, b
            frequency = 246.9;
            break;
        case 70: //f key, c
            frequency = 261.6;
            break;
        case 84: //t key, c sharp
            frequency = 277.2;
            break;
        case 71: //g key, d
            frequency = 293.7;
            break;
        case 89: //y key, d sharp
            frequency = 311.1;
            break;
        case 72: //h key, e
            frequency = 329.6;
            break;  
        case 74: //j key, f
            frequency = 349.2;
            break;
        case 73: //i key, f sharp
            frequency = 370;
            break;
        case 75: //k key, high g
            frequency = 392;
            break;
        default:
            return;
    } 
    if(!activeNotes[code] && !keyboard.classList.contains('hidden')) {
        let note = new Note(frequency);
        activeNotes[code] = note;
        keyCodeCombo[code].classList.add('active');
        note.start();
    }
    
    checkChord();

})

document.addEventListener('keyup', e => {
    let code = e.keyCode ? e.keyCode : e.which;
    if (activeNotes[code]) {
        activeNotes[code].stop();
        activeNotes[code] = null;
        
        keyCodeCombo[code].classList.remove('active');
    }
})

function checkChord() {
    var count = 0;
    var noteFrequencies = [];
    Object.keys(activeNotes).forEach(key => {
        if (activeNotes[key]) {
            count++;
            noteFrequencies.push(activeNotes[key].frequency);
        }
    })
    if (count === 3) {
        noteFrequencies.sort();
        let freq1 = noteFrequencies[0];
        let freq2 = noteFrequencies[1];
        let freq3 = noteFrequencies[2];        
        changeBackground(freq1, freq2, freq3);
    }
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

/* 
    This function takes in 3 frequencies in hertz from 
    smallest to largest, and based on their ratios to one
    another, decides if the chord is major. This could
    probably be optimized, but it works for now.
*/
function major(freq1, freq2, freq3) {
    return (Math.abs((freq2 / 5) - (freq1 / 4)) < 1
         && Math.abs((freq3 / 6) - (freq1 / 4)) < 1)
        || (Math.abs((freq2 / 6) - (freq1 / 5)) < 1
         && Math.abs((freq3 / 8) - (freq1 / 5)) < 1)
        || (Math.abs((freq2 / 4) - (freq1 / 3)) < 1
         && Math.abs((freq3 / 5) - (freq1 / 3)) < 1)
}

/* 
    This function takes in 3 frequencies in hertz from 
    smallest to largest, and based on their ratios to one
    another, decides if the chord is minor. This could
    probably be optimized, but it works for now.
*/
function minor(freq1, freq2, freq3) {
    return (Math.abs((freq2 / 12) - (freq1 / 10)) < 1
         && Math.abs((freq3 / 15) - (freq1 / 10)) < 1)
        || (Math.abs((freq2 / 15) - (freq1 / 12)) < 1
         && Math.abs((freq3 / 20) - (freq1 / 12)) < 1)
        || (Math.abs((freq2 / 20) - (freq1 / 15)) < 1
         && Math.abs((freq3 / 24) - (freq1 / 15)) < 1)
}
    
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

var width = 16;
var height = 14;

var machineBody = document.createElement('tbody');
machineBody.classList.add('machine');
let tableHTML = '';
for (var h = 0; h < height; h++) {
    tableHTML += "<tr id='row+" + h + "'>";
    for (var w = 0; w < width; w++) {
        if (w%4 === 0){
            tableHTML += "<td data-status='dead' id='" + w + "-" + h + "' class='fourth'></td>";
        } else {
            tableHTML += "<td data-status='dead' id='" + w + "-" + h + "'></td>";            
        }
    }
    tableHTML += "</tr>";
}
machineBody.innerHTML = tableHTML;

var machineTable = document.getElementById('machine-table')
machineTable.appendChild(machineBody);

var openMachine = document.getElementById('open-machine-btn');
openMachine.addEventListener('click', () => {
    machineTable.classList.toggle('hidden');
    if (openMachine.innerText === 'Open Synth Machine') openMachine.innerText = 'Close Synth Machine';
    else openMachine.innerText = 'Open Synth Machine';
})
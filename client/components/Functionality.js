import React, {Component} from 'react';
import { connect } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer';
import Keyboard from './Keyboard';
import OptionsContainer from './OptionsContainer';
import Sequencer from './Sequencer';

import { codes } from '../lib/keys';
import Note from '../lib/Note'; 

class Functionality extends Component {

    constructor(props) {
        super(props);
        this.audioContext = new AudioContext();
        this.activeNotes = {};

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this); 
        this.checkChord = this.checkChord.bind(this);
    }

    handleKeyDown(e) {
        let code = e.keyCode ? e.keyCode : e.which;
        
        if (!this.activeNotes[code] && codes[code]) {
            let octave = document.getElementById('octave').value;
            let frequency = codes[code].frequency * Math.pow(2, octave);
            let waveform = document.getElementById('waveform').value;
            let volume = document.getElementById('volume').value;
            let distortion = document.getElementById('distortion').value;
            let sustain = document.getElementById('sustain').value;
            let note = new Note(frequency, this.audioContext, waveform, volume, distortion, sustain);
            this.activeNotes[code] = note;
            document.getElementById(codes[code].name).classList.add('active');
            note.start();
        }
        
        this.checkChord();    
    }
    
    handleKeyUp(e) {
        let code = e.keyCode ? e.keyCode : e.which;
        if (this.activeNotes[code]) {
            this.activeNotes[code].stop();
            this.activeNotes[code] = null;
            document.getElementById(codes[code].name).classList.remove('active');
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
            <div id="main" className="container-fluid" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
                <Navbar />
                <div className="center title">
                    <h1 className="center">Synth</h1>
                </div>
                <div id="functionality">
                    <OptionsContainer />
                    <Keyboard />
                    <Sequencer />
                </div>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = ({sequence}) => ({sequence});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Functionality);
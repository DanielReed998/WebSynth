import React, {Component} from 'react';
import { connect } from 'react-redux';

import Keyboard from './Keyboard';
import OptionsContainer from './OptionsContainer';
import Sequencer from './Sequencer';

import { codes } from '../../scripts/keys';
import Note from '../../scripts/Note'; 
import { addNote, removeNote } from '../reducers';

class Functionality extends Component {

    constructor(props) {
        super(props);
        this.audioContext = new AudioContext();
        this.activeNotes = {};

        this.checkChord = this.checkChord.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            const code = e.keyCode ? e.keyCode : e.which;
            const activeNotes = this.props.activeNotes;

            if (!activeNotes[code] && codes[code]) {
                let id = codes[code].id;
                let octave = document.getElementById('octave').value;
                let frequency = codes[code].frequency * Math.pow(2, octave);
                let waveform = document.getElementById('waveform').value;
                let volume = document.getElementById('volume').value;
                let distortion = document.getElementById('distortion').value;
                let sustain = document.getElementById('sustain').value;
                let note = new Note(id, frequency, this.audioContext, waveform, volume, distortion, sustain);
                this.props.dispatchAddNote(code, note);
                document.getElementById(codes[code].name).classList.add('active');
                note.start();
            }
            
            this.checkChord();    
        });

        document.addEventListener('keyup', (e) => {
            const code = e.keyCode ? e.keyCode : e.which;
            const activeNotes = this.props.activeNotes;

            if (activeNotes[code]) {
                this.props.disptachRemoveNote(code);
                document.getElementById(codes[code].name).classList.remove('active');
            }
            
        });
    }
    
    checkChord() {
        var count = 0;
        var noteIds = [];
        let activeNotes = this.props.activeNotes;
        Object.keys(activeNotes).forEach(key => {
            if (activeNotes[key]) {
                count++;
                noteIds.push(activeNotes[key].id);
            }
        })
        if (count === 3) {
            noteIds.sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                if (a === b) return 0;
            });
            let id1 = noteIds[0];
            let id2 = noteIds[1];
            let id3 = noteIds[2];        
            changeBackground(id1, id2, id3);
        }
    
        function changeBackground(id1, id2, id3) {
            var body = document.getElementById('body');
            if (major(id1, id2, id3)) {
                body.classList = 'container';
                body.classList.add('orange');
            } else if (minor(id1, id2, id3)) {
                body.classList = 'container';
                body.classList.add('blue');
            } else {
                body.classList = 'container';
                body.classList.add('grey');
            }
        }
    
        function major(id1, id2, id3) {
            const firstDiff = id2-id1;
            const secondDiff = id3-id2;
            return firstDiff === 4 && secondDiff === 3 ||
                   firstDiff === 3 && secondDiff === 5 ||
                   firstDiff === 5 && secondDiff === 4;
        }
        
        function minor(id1, id2, id3) {
            const firstDiff = id2-id1;
            const secondDiff = id3-id2;
            return firstDiff === 3 && secondDiff === 4 ||
                   firstDiff === 4 && secondDiff === 5 ||
                   firstDiff === 5 && secondDiff === 3;
        }
    }

    render() {
        return (
            <div id="main" className="container-fluid" autoFocus={true} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="0">
                <div className="center title">
                    <h1 className="center">WebSynth v1.0</h1>
                </div>
                <div id="functionality">
                    <OptionsContainer />
                    <Keyboard />
                    <div className="label-container">
                        <h6>^These are mapped to keys 'A' through 'K' on your keyboard^</h6>
                    </div>
                    <Sequencer />
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({sequence, activeNotes}) => ({sequence, activeNotes});

const mapDispatchToProps = () => dispatch => {
    return {
        dispatchAddNote: (code, note) => {
            dispatch(addNote(code, note));
        },
        disptachRemoveNote: (code) => {
            dispatch(removeNote(code));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Functionality);
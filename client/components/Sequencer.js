import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { updateSequence, updateOption, saveSequence, getSequence } from '../reducers/sequence';
import Note from '../lib/Note';
import { codes, noteNames } from '../lib/keys';
import emptySequence from '../lib/empty-sequence';

class Sequencer extends Component {

    constructor(props) {
        super(props);
        this.interval = null;
        this.beat = 0;

        this.audioContext = new AudioContext();
        this.activeNotes = {};

        this.startInterval = this.startInterval.bind(this);
        this.stopInterval = this.stopInterval.bind(this);
        this.handleTempoChange = this.handleTempoChange.bind(this);
        this.checkChord = this.checkChord.bind(this);
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);        
    }

    startInterval() {
        let notes = Object.keys(this.props.sequence.data);
        let tempo = (15000 / parseInt(document.getElementById('tempo-slider').value)) || this.props.sequence.tempo;
        if (!this.interval) {
            this.interval = setInterval(()=> {

                //each beat, determine the options for the notes
                let accent = parseInt(document.getElementById('accent-slider').value);
                let accentBox = document.getElementById(`${this.beat}-accent`);
                let volume = accentBox.classList.contains('active-option') ? 100+accent : 100-accent;

                let octaveSwitch = 0;
                let upOctaveBox = document.getElementById(`${this.beat}-octaveUp`);
                if (upOctaveBox.classList.contains('active-option')) octaveSwitch = 1;
                let downOctaveBox = document.getElementById(`${this.beat}-octaveDown`);
                if (downOctaveBox.classList.contains('active-option')) octaveSwitch = -1;

                //each beat, go through all the notes
                notes.forEach(note => {

                    let code = noteNames[note].code;

                    //change the background of all the notes in the last beat back to white.
                    let lastBeat = this.beat === 0 ? 15 : this.beat - 1;
                    let lastNoteBox = document.getElementById(`${lastBeat}-${note}`)
                    if (lastNoteBox.classList.contains('beat')) lastNoteBox.classList.toggle('beat');
        
                    //if any of the last notes are playing, stop them
                    if (lastNoteBox.classList.contains('active-note')){
                        if (this.activeNotes[code]) {
                            this.activeNotes[code].stop();
                            this.activeNotes[code] = null;
                        }
                    }
        
                    //change the background of all the notes in the current beat
                    let noteBox = document.getElementById(`${this.beat}-${note}`);
                    noteBox.classList.toggle('beat');
        
                    //play any notes that are active
                    if (noteBox.classList.contains('active-note')){
                        if (!this.activeNotes[code]) {
                            const frequency = codes[code].frequency * Math.pow(2, octaveSwitch);
                            const distortion = document.getElementById('distortion-slider').value;
                            const sustain = document.getElementById('sustain-slider').value;
                            const waveform = document.getElementById('sequence-waveform').value;
                            
                            const playNote = new Note(frequency, 
                                                    this.audioContext, 
                                                    waveform, 
                                                    volume, 
                                                    distortion, 
                                                    sustain);
                            this.activeNotes[code] = playNote;
                            playNote.start();
                        }
                    }
                    this.checkChord();
                })
                this.beat = (this.beat + 1) % 16;
            }, tempo)
        } else {
            console.error(`this.interval is ${this.interval}`);
        }
    }

    stopInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        Object.keys(this.props.sequence.data).forEach(note => {
            let code = noteNames[note].code;
            
            let noteBox = document.getElementById(`${this.beat}-${note}`);
            let lastBeat = this.beat === 0 ? 15 : this.beat - 1;
            let lastNoteBox = document.getElementById(`${lastBeat}-${note}`)
            lastNoteBox.classList.toggle('beat');
            if (noteBox.classList.contains('active-note') ||
                lastNoteBox.classList.contains('active-note')){
                    if (this.activeNotes[code]) {
                        this.activeNotes[code].stop();
                        // this.activeNotes[code] = null;
                    }
            }
            
        })
    }

    handleTempoChange() {

        document.getElementById('tempo-label').innerHTML = document.getElementById('tempo-slider').value + ' bpm';
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.startInterval();
        }
    }

    checkChord() {
        var noteFrequencies = [];
        Object.keys(this.activeNotes).forEach(key => {
            if (this.activeNotes[key]) {
                noteFrequencies.push(this.activeNotes[key].frequency);
            }
        })
        if (noteFrequencies.length === 3) {
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

    save() {
        this.props.save(this.props.sequence);
    }

    clear() {
        this.props.clear();
    }

    render() {
        if (this.props.sequence.data) {
            const sequenceData = this.props.sequence.data;
            const sequenceOptions = this.props.sequence.options;
            return (
                <div id="sequencer-main">
                    <h4 className="title">Sequencer</h4>
                    <div id="option-sliders">
                        <div>
                            <label>tempo: </label>
                            <label id="tempo-label">{'100 bpm'}</label>
                            <input id="tempo-slider" orient="vertical" onChange={this.handleTempoChange} type="range" className="slider option-slider" min="40" max="300" defaultValue="120"/>
                        </div>
                        <div>
                            <label>distortion: </label>
                            <input id="distortion-slider" orient="vertical" type="range" className="slider option-slider" min="0" max="100" defaultValue="0"/>
                        </div>
                        <div>
                            <label>sustain: </label>
                            <input id="sustain-slider" orient="vertical" type="range" className="slider option-slider" min="50" max="3000" defaultValue="200"/>                            
                        </div>
                        <div>
                            <label>accent: </label>
                            <input id="accent-slider" orient="vertical" type="range" className="slider option-slider" min="10" max="100" defaultValue="40"/>                            
                        </div>
                        <div>
                            <label>waveform: </label>
                            <select id="sequence-waveform">
                                <option value="sine">sine</option>
                                <option value="square">square</option>
                                <option value="triangle">triangle</option>
                                <option value="sawtooth">sawtooth</option>                                
                            </select>
                        </div>
                    </div>
                    <div id="machine">
                        <div className="table-container">
                            <table id={'machine-table'} className="sequence-table">
                                <tbody>
                                    {Object.keys(sequenceData).reverse().map(note => {
                                        return (
                                            <tr key={note} id={`row ${note}`}>
                                                {Object.keys(sequenceData[note]).map(beat => {
                                                    let beatClass;
                                                    if (parseInt(beat)%4 === 0 && sequenceData[note][beat] === false) {
                                                        beatClass = classnames({fourth: true})
                                                    } else if (sequenceData[note][beat] === true) {
                                                        beatClass = classnames({'active-note': true})
                                                    } 
                                                    return (
                                                        <td key={beat} 
                                                            id={`${beat}-${note}`} 
                                                            className={beatClass} 
                                                            onClick={() => {
                                                                this.props.writeNote(note, beat)
                                                            }
                                                        }/> 
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <ul className="table-labels">
                                {Object.keys(sequenceData).reverse().map(note => {
                                    return (
                                        <li key={note}>{note.length > 1 ? note[0] + '#' : note}</li>
                                    )
                                })}
                            </ul>  
                        </div>
                        <div className="table-container">
                            <table id={'options-table'} className="sequence-table">
                                <tbody>
                                    {Object.keys(sequenceOptions).map(option => {
                                        return (
                                            <tr key={option} id={`row ${option}`}>
                                                {Object.keys(sequenceOptions[option]).map(beat => {
                                                    let beatClass;
                                                    if (parseInt(beat)%4 === 0 && sequenceOptions[option][beat] === false) {
                                                        beatClass = classnames({fourth: true})
                                                    } else if (sequenceOptions[option][beat] === true) {
                                                        beatClass = classnames({'active-option': true})
                                                    } 
                                                    return (
                                                        <td key={beat} 
                                                            id={`${beat}-${option}`} 
                                                            className={beatClass} 
                                                            onClick={() => {
                                                                this.props.writeOption(option, beat)
                                                            }}
                                                        /> 
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <ul  className="table-labels">
                                {Object.keys(sequenceOptions).map(option => {
                                    return (
                                        <li key={option}>{option === 'accent' ? 'Accent' : "Octave " + option.slice(6)}</li>
                                    )
                                })}
                            </ul>  
                        </div>
                        <div className="button-container center">
                            <button 
                                onClick={() => {
                                    this.beat = 0;
                                    this.startInterval()
                                }} 
                                className="btn btn-primary">Start</button>
                            <button onClick={this.stopInterval} className="btn btn-danger">Stop</button>
                            <button onClick={this.save} className="btn btn-warning">Save</button>  
                            <button onClick={this.clear} className="btn btn-info">Clear</button>
                        </div>
                    </div>                  
                </div>
            )
        } else {
            return null;
        }
    }
}

const mapStateToProps = ({ sequence }) => ({ sequence });
const mapDispatchToProps = () => dispatch => {
    return {
        writeNote: (note, beat) => {
            dispatch(updateSequence(note, beat))
        },
        writeOption: (option, beat) => {
            dispatch(updateOption(option, beat));
        },
        save: (updatedSequence) => {
            dispatch(saveSequence(updatedSequence))
        },
        clear: () => {
            let es = emptySequence();
            dispatch(getSequence(es));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Sequencer);

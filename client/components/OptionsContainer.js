import React, { Component } from 'react';

export default class OptionsContainer extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let newWave = e.target.value;
        document.getElementById('wave-img').classList = [];
        document.getElementById('wave-img').classList = newWave;        
    }

    render() {
        return (
            <div id="options-container" className="center">
                <div id="wave-img" className="sine">
                    <img src="/images/sine.jpg" visibility="hidden" />
                </div>
                <select id="waveform" onChange={this.handleChange}>
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
                <label>Volume: </label>
                <input id="volume" type="range" className="slider" min="0" max="200" defaultValue="100"  />
                <label>Sustain: </label>
                <input id="sustain" type="range" className="slider" min="50" max="3000" defaultValue="200" />
            </div>
        )
    }
}
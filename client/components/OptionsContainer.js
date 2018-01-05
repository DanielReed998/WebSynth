import React from 'react';

export default function OptionsContainer () {
    return (
        <div id="options-container">
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
            <label>Volume: </label>
            <input id="volume" type="range" className="slider" min="0" max="200" defaultValue="100"  />
        </div>
    )
}
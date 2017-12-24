import React from 'react';
import { NavLink } from 'react-router-dom';
import { play } from './WebAudio';


export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <div>
                <select ref='waveform'>
                    <option value='sine'>Sine</option>
                    <option value='square'>Square</option>
                    <option value='sawtooth'>Sawtooth</option>
                    <option value='triangle'>Triangle</option>
                </select>
                <button onClick={play()}>Play</button>
            </div>
            <NavLink to="/anotherPage">Go to another page</NavLink>
        </div>
    );
}
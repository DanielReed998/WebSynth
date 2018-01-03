import React from 'react';
import { NavLink } from 'react-router-dom';

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
            </div>
            <NavLink to="/anotherPage">Go to another page</NavLink>
        </div>
    );
}
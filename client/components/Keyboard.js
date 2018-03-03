import React from 'react';

export default function Keyboard() {
    return (
        <div id="keyboard">
            <div id="sharps">
                <button id="g-sharp" className="sharp-note"></button>
                <button id="a-sharp" className="sharp-note"></button>
                <button id="b-sharp" className="fake-sharp-note" />
                <button id="c-sharp" className="sharp-note"></button>
                <button id="d-sharp" className="sharp-note"></button>
                <button id="e-sharp" className="fake-sharp-note" />
                <button id="f-sharp" className="sharp-note"></button>
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
    )
}
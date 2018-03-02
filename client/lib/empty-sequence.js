function createEmptyBeats(n) {
    let obj = {};
    for (let i = 0; i < n; i++) {
        obj[i] = false;
    }
    return obj;
}

export const emptySequenceData = {
        g: createEmptyBeats(16),
        gSharp: createEmptyBeats(16),
        a: createEmptyBeats(16),
        aSharp: createEmptyBeats(16),
        b: createEmptyBeats(16),
        c: createEmptyBeats(16),
        cSharp: createEmptyBeats(16),
        d: createEmptyBeats(16),
        dSharp: createEmptyBeats(16),
        e: createEmptyBeats(16),
        f: createEmptyBeats(16),
        fSharp: createEmptyBeats(16),
        G: createEmptyBeats(16),
}

export const emptySequenceOptions = {
    accent: createEmptyBeats(16),
    octaveUp: createEmptyBeats(16),
    octaveDown: createEmptyBeats(16)
}

export default {
    accent: 30,
    data: emptySequenceData,
    name: 'empty sequence table',
    options: emptySequenceOptions,
    sustain: 100,
    tempo: 100,
}
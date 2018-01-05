function createEmptyBeats(n) {
    let obj = {};
    for (let i = 0; i < n; i++) {
        obj[i] = false;
    }
    return obj;
}

export default (startNote) => {
    return {
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
}

export const emptyOptionsSequence = {
    accent: createEmptyBeats(16),
    octaveUp: createEmptyBeats(16),
    octaveDown: createEmptyBeats(16)
}
const defaultState = {
    '65': null,
    '87': null,
    '83': null,
    '69': null,
    '68': null,
    '70': null,
    '84': null,
    '71': null,
    '89': null,
    '72': null,
    '74': null,
    '73': null,
    '75': null
};

/* ACTION TYPES */
const ADD_NOTE = 'ADD_NOTE';
const REMOVE_NOTE = 'REMOVE_NOTE';


/* ACTION CREATORS */ 
export const addNote = (code, note) => {
    return {
        type: ADD_NOTE,
        code,
        note
    }
}

export const removeNote = (code) => {
    return {
        type: REMOVE_NOTE,
        code
    }
}


/* REDUCER */

export default (prevState = defaultState, action) => {
    switch (action.type) {
        case ADD_NOTE:
            return Object.assign({}, prevState, {[action.code]: action.note});
        case REMOVE_NOTE:
            prevState[action.code].stop();
            return Object.assign({}, prevState, {[action.code]: null});
        default:
            return prevState;
    }
}


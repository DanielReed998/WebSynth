import emptySequence from '../lib/empty-sequence';
import axios from 'axios';

/* ACTION TYPES */

const UPDATE_SEQUENCE = 'UPDATE_SEQUENCE';
const UPDATE_OPTION = 'UPDATE_OPTION';
const GET_SEQUENCE = 'GET_SEQUENCE';


/* ACTION CREATORS */ 
export const updateSequence = (note, beat) => {
    console.log(note, beat);
    return {
        type: UPDATE_SEQUENCE,
        note,
        beat
    }
}

export const updateOption = (option, beat) => {
    console.log(option, beat);    
    return {
        type: UPDATE_OPTION,
        option,
        beat
    }
}

export const getSequence = (sequence) => {
    return {
        type: GET_SEQUENCE,
        sequence
    }
}

/* DISPATCH */

export const fetchSavedSequence = (id) => {
    return (dispatch) => {
        axios.get('/api/sequences/1')
        .then(res => res.data)
        .then(sequence => {
            dispatch(getSequence(sequence))
        })
        .catch(err => console.error(err));
    }
}

export const saveSequence = (sequence) => {
    return (dispatch) => {
        axios.put('/api/sequences/1', sequence)
        .then(res => res.data)
        .then(newSequence => {
            dispatch(getSequence(newSequence))
        })
        .catch(err => console.error(err));
    }
}

// export const postSequence = (sequence) => {
//     return (dispatch) => {
//         axios.post('/api/sequences', sequence)
//         .then(res => res.data)
//         .then(postedSequence => dispatch(getSequence(postedSequence)))
//         .catch(err => console.error(err));
//     }
// }



/* REDUCER */

export default (prevSequence = {}, action) => {
    switch (action.type) {
        case UPDATE_SEQUENCE:
            let updatedSequence = Object.assign({}, prevSequence);
            updatedSequence.data[action.note][action.beat] = !updatedSequence.data[action.note][action.beat];
            return updatedSequence;
        case UPDATE_OPTION:
            let updatedOptions = Object.assign({}, prevSequence);
            updatedOptions.options[action.option][action.beat] = !updatedOptions.options[action.option][action.beat];
            return updatedOptions;
        case GET_SEQUENCE:
            return Object.assign({}, action.sequence);
        default:
            return prevSequence;
    }
}


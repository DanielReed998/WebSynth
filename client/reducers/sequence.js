import emptySequence from '../../scripts/empty-sequence';

const defaultState = emptySequence();

/* ACTION TYPES */
const UPDATE_SEQUENCE = 'UPDATE_SEQUENCE';
const UPDATE_OPTION = 'UPDATE_OPTION';
const GET_SEQUENCE = 'GET_SEQUENCE';
const CLEAR_SEQUENCE = 'CLEAR_SEQUENCE';


/* ACTION CREATORS */ 
export const updateSequence = (note, beat) => {
    return {
        type: UPDATE_SEQUENCE,
        note,
        beat
    }
}

export const updateOption = (option, beat) => {
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

export const clearSequence = () => {
    return {
        type: CLEAR_SEQUENCE
    }
}

/* DISPATCH */

/*Taking out backend sequence persistence for now. Once I add more features that can be associated
** with a user, I'll reconnect these. */

// export const fetchSavedSequence = (id) => {
//     return (dispatch) => {
//         axios.get('/api/sequences/1')
//         .then(res => res.data)
//         .then(sequence => {
//             dispatch(getSequence(sequence))
//         })
//         .catch(err => console.error(err));
//     }
// }

// export const saveSequence = (sequence) => {
//     return (dispatch) => {
//         axios.put('/api/sequences/1', sequence)
//         .then(res => res.data)
//         .then(newSequence => {
//             dispatch(getSequence(newSequence))
//         })
//         .catch(err => console.error(err));
//     }
// }

// export const resetSequence = () => {
//     return (dispatch) => {
//         axios.put('/api/sequences/1', {
//             data: emptySequenceData,
//             options: emptySequenceOptions
//         })
//         .then(res => res.data)
//         .then(clearSequence => {
//             dispatch(getSequence(clearSequence))
//         })
//         .catch(err => console.error(err));
//     }
// }

// export const postSequence = (sequence) => {
//     return (dispatch) => {
//         axios.post('/api/sequences', sequence)
//         .then(res => res.data)
//         .then(postedSequence => dispatch(getSequence(postedSequence)))
//         .catch(err => console.error(err));
//     }
// }



/* REDUCER */

export default (prevSequence = defaultState, action) => {
    switch (action.type) {
        case UPDATE_SEQUENCE:
            let updatedSequence = Object.assign({}, prevSequence);
            updatedSequence.data[action.note][action.beat] = !updatedSequence.data[action.note][action.beat];
            return updatedSequence;
        case UPDATE_OPTION:
            let updatedOptions = Object.assign({}, prevSequence);
            updatedOptions.options[action.option][action.beat] = !updatedOptions.options[action.option][action.beat];
            return updatedOptions;
        case CLEAR_SEQUENCE:
            return Object.assign({}, emptySequence());
        case GET_SEQUENCE:
            return Object.assign({}, action.sequence);
        default:
            return prevSequence;
    }
}


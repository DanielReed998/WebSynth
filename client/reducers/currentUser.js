import axios from 'axios';


const SET_CURRENT_USER = 'SET_CURRENT_USER';
const CLEAR_CURRENT_USER = 'CLEAR_CURRENT_USER';

const setCurrentUser = userInfo => ({type: SET_CURRENT_USER, userInfo})
const clearCurrentUser = () => ({type: CLEAR_CURRENT_USER})

export default function reducer(currentUser = {}, action){
    switch (action.type){
        case SET_CURRENT_USER: 
            return action.userInfo;
        case CLEAR_CURRENT_USER:
            return {};
        default:
            return currentUser;
    }
}

export const fetchUser = function (userInfo) {
    console.log(userInfo)
    return function(dispatch) {
        axios.post('/api/users/login', userInfo)
        .then(res => {
            dispatch(setCurrentUser(res.data))
            console.log(res.data);
        })
        .catch(err => console.error(err));
    }
}

// export const fetchCurrentUser = function () {
//     return function(dispatch) {
//         axios.get('/api/users/session-id')
//         .then(res => {
//             dispatch(setCurrentUser(res.data))
//         })
//         .catch(err => console.error(err));
//     }
// }

export const clearSessionId = function () {
    return function(dispatch) {
        axios.post('/api/users/logout', {})
        .then(() => {
            dispatch(clearCurrentUser())
        })
        .catch(err => console.error(err));
    }
}
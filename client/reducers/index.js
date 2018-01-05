import { combineReducers } from 'redux';

import sequence from './sequence';
import currentUser from './currentUser';
import users from './users';

export default combineReducers({ sequence, currentUser, users });
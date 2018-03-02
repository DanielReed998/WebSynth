import { combineReducers } from 'redux';

import sequence from './sequence';
import activeNotes from './activeNotes';
import currentUser from './currentUser';
import users from './users';

export default combineReducers({ sequence, activeNotes, currentUser, users });

export * from './sequence';
export * from './activeNotes';
export * from './currentUser';
export * from './users';
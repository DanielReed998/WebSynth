import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

//removed logger for now - , composeWithDevTools(applyMiddleware(thunk, logger))

export default createStore(rootReducer);
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import {createLogger} from 'redux-logger';


const inititalState = {};

const logger = createLogger({
        /* https://github.com/evgenyrodionov/redux-logger */
        collapsed: true,
        diff: true
    });

const store = createStore(
        rootReducer, 
        inititalState, 
        composeWithDevTools(applyMiddleware(thunk, logger)));

export default store;
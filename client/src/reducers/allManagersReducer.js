import { FETCH_ALL_MANAGERS_PENDING, FETCH_ALL_MANAGERS_FULFILLED, FETCH_ALL_MANAGERS_REJECTED,
         POST_CAPABILITY_REQUEST_PENDING, POST_CAPABILITY_REQUEST_FULFILLED, 
         POST_CAPABILITY_REQUEST_REJECTED } from '../actions/types';

const initialState = {
                        allManagers: [],
                        allManagers_fetching: false,
                        allManagers_fetched: false,
                        error: null,
                        sendRequest_fetching: false,
                        sendRequest_fetched: false
                      }

    export default function(state = initialState, action ) {
        switch(action.type) {
        case FETCH_ALL_MANAGERS_PENDING:
            return {
                ...state,
                allManagers_fetching: true
            }
        case FETCH_ALL_MANAGERS_FULFILLED:
            return {
                ...state,
                allManagers: action.payload,
                allManagers_fetched: true,
                allManagers_fetching: false
            }
        case FETCH_ALL_MANAGERS_REJECTED:
            return {
                ...state,
                allManagers_fetching: false,
                error: action.payload
            }
        case POST_CAPABILITY_REQUEST_PENDING:
            return {
                ...state,
                sendRequest_fetching: true
            }
        case POST_CAPABILITY_REQUEST_FULFILLED:
            return {
                ...state,
                sendRequest_fetched: true,
                sendRequest_fetching: false
            }
        case POST_CAPABILITY_REQUEST_REJECTED:
            return {
                ...state,
                error: action.payload,
                sendRequest_fetching: false
            }
        default: 
            return state;
        }
    }
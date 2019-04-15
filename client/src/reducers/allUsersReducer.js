import { FETCH_ALL_USERS_PENDING, FETCH_ALL_USERS_FULFILLED, FETCH_ALL_USERS_REJECTED,
         ADD_USER_TO_CAPABILITY_PENDING, ADD_USER_TO_CAPABILITY_FULFILLED, 
         ADD_USER_TO_CAPABILITY_REJECTED, DELETE_USER_TO_CAPABILITY_PENDING,
         DELETE_USER_TO_CAPABILITY_FULFILLED, DELETE_USER_TO_CAPABILITY_REJECTED } from '../actions/types';
import { stat } from 'fs';

const initialState = {
    users: [],
    users_fetching: false,
    user_fetched: false,
    error: null,
    capability_users_pending: false
}

export default function(state = initialState, action ) {
    switch(action.type) {
        case FETCH_ALL_USERS_PENDING:
            return {
                ...state,
                users_fetching: true
            }
        case FETCH_ALL_USERS_FULFILLED:
            return {
                ...state,
                users: action.payload,
                user_fetched: true,
                users_fetching: false
            }
        case FETCH_ALL_USERS_REJECTED:
            return {
                ...state,
                users_fetching: false,
                error: action.payload
            }
        case ADD_USER_TO_CAPABILITY_PENDING:
            return {
                ...state,
                capability_users_pending: true
            }
        case ADD_USER_TO_CAPABILITY_FULFILLED:
            var updatedUser = state.users;
            for(let i=0; i<updatedUser.length; i++){
                if(updatedUser[i]._id == action.payload.id_user){
                        updatedUser[i].capabilities.push(action.payload.capability_id);
                }
            }
            return {
                ...state,
                users: updatedUser,
                capability_users_pending: false
            }
        case ADD_USER_TO_CAPABILITY_REJECTED:
            return {
                ...state,
                error: action.payload
            }
        case DELETE_USER_TO_CAPABILITY_FULFILLED:
            var updatedUser = state.users;
            for(let i=0; i<updatedUser.length; i++){
                if(updatedUser[i]._id == action.payload.id_user){
                    let index = updatedUser[i].capabilities.findIndex(capability_id => capability_id == action.payload.capability_id);
                    updatedUser[i].capabilities.splice(index,1);
                }
            }            
            return {
                ...state,
                users: updatedUser
            }
        case DELETE_USER_TO_CAPABILITY_REJECTED:
            return {
                ...state,
                error: action.payload
            }
        default: 
            return state;
    }
}
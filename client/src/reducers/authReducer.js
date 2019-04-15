import { SET_CURRENT_USER, REMOVE_PERMISSION_FROM_USER } from '../actions/types';
import isEmpty from '../is-empty';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        case REMOVE_PERMISSION_FROM_USER:
            var index = state.user.hasPermissionToAddExpense.indexOf(action.payload);
            var newArrayPermission = state.user.hasPermissionToAddExpense;
            if (index > -1) {
                newArrayPermission.splice(index, 1);
            }
            return {
                ...state,
                user: {...state.user, hasPermissionToAddExpense: newArrayPermission }
            }
        default: 
            return state;
    }
}
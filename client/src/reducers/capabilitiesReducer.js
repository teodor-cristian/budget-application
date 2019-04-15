import { FETCH_CAPABILITIES_PENDING, FETCH_CAPABILITIES_FULFILLED, FETCH_CAPABILITIES_REJECTED,
         POST_EXPENSE_SECOND_CATEGORY } from '../actions/types';

const initialState = {
    fetching: false,
    fetched: false,
    capabilities: [],
    error: null,
    posted_second_expense: false
}

export default function(state = initialState, action ) {
    switch(action.type) {
        case FETCH_CAPABILITIES_PENDING:
            return {
                ...state,
                fetching: true
            }
        case FETCH_CAPABILITIES_FULFILLED:
            return {
                ...state,
                fetching: false,
                fetched: true,
                capabilities: action.payload
            }
        case FETCH_CAPABILITIES_REJECTED:
            return {
                ...state,
                fetching: false,
                error: action.payload
            }
        case POST_EXPENSE_SECOND_CATEGORY:
           state.capabilities[action.payload.index_capabilitate].categories[action.payload.index_categorie].list_of_expenses.push(action.payload.newExpense);
           state.capabilities[action.payload.index_capabilitate].categories[action.payload.index_categorie].budget -= action.payload.newExpense.sum;
           return {
               ...state,
               posted_second_expense: true
           }
        default:
            return {
                ...state
            }
    }
}
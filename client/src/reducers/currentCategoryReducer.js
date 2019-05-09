import { SET_CURRENT_CATEGORY, GET_CURRENT_CATEGORY, ADD_NEW_REQUEST,
         POST_NEW_REQUEST_PENDING, POST_NEW_REQUEST_FULFILLED, POST_NEW_REQUEST_REJECTED,
         POST_NEW_COMMENT_PENDING, POST_NEW_COMMENT_FULFILLED, POST_NEW_COMMENT_REJECTED,
         POST_NEW_EXPENSE_PENDING, POST_NEW_EXPENSE_FULFILLED, POST_NEW_EXPENSE_REJECTED,
         FILTER_REQUESTS } from './../actions/types';

const initialState = {
    _id_capabilitate: null,
    current_category: {name: "testtesttest", requests: [], list_of_expenses: []},
    current_category_unchanged: {},
    is_set: false,
    posting_new_category: false,
    posted_new_category: false,
    error: null,
    posting_new_comment: false,
    posted_new_comment: false,
    posting_new_expense: false,
    posted_new_expense: false
}

export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_CURRENT_CATEGORY:
            return {
                ...state,
                current_category: action.payload.category,
                current_category_unchanged: action.payload.category,
                _id_capabilitate: action.payload._id_capabilitate,
                is_set: true
            }
        case GET_CURRENT_CATEGORY:
            return {
                ...state
            }
        case ADD_NEW_REQUEST:
            var requestList=state.current_category.requests;
            requestList.push(action.payload);
            return{
            ...state,
            current_category: {...state.current_category, requests: requestList}
            }
        case POST_NEW_REQUEST_PENDING:
            return {
                ...state,
                posting_new_category: true
            }
        case POST_NEW_REQUEST_FULFILLED:
            var requestList=state.current_category.requests;
            requestList.push(action.payload);
            return {
                ...state,
                posting_new_category: false,
                posted_new_category: true,
                current_category: {...state.current_category, requests: requestList},
                current_category_unchanged: {...state.current_category_unchanged, requests: requestList}
            }
        case POST_NEW_REQUEST_REJECTED:
            return {
                ...state,
                posting_new_category: false,
                error: action.payload
            }
        case POST_NEW_COMMENT_PENDING:
            return {
                ...state,
                posting_new_comment: true
            }
        case POST_NEW_COMMENT_FULFILLED:
            var requestList=state.current_category.requests;
            requestList[action.payload.request_index].comments.push(action.payload.newComment);
            return {
                ...state,
                posting_new_comment: false,
                posted_new_comment: true,
                // current_category: {...state.current_category, requests: requestList.reverse()}, // .reverse()
                // current_category_unchanged: {...state.current_category_unchanged, requests: requestList.reverse()}  // .reverse()
            }
        case POST_NEW_COMMENT_REJECTED:
            return {
                ...state,
                posting_new_comment: false,
                error: action.payload
            }
        case POST_NEW_EXPENSE_PENDING:
            return {
                ...state,
                posting_new_expense: true,
                posted_new_expense: false
            }
        case POST_NEW_EXPENSE_FULFILLED:
           state.current_category.list_of_expenses.push(action.payload);
           state.current_category.budget -= action.payload.sum;
            return {
                ...state,
                posting_new_expense: false,
                posted_new_expense: true,
            }
        case POST_NEW_EXPENSE_REJECTED:
            return {
                ...state,
                posting_new_expense: false,
                error: action.payload
            }
        case FILTER_REQUESTS:
            return {
                ...state,
                current_category: {...state.current_category, requests: action.payload}
            }
        default:
            return {
                ...state
            }
    }
}
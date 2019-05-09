import { SET_CURRENT_CAPABILITY, GET_CURRENT_CAPABILITY, SET_CURRENT_CATEGORY_MANAGER,
         SET_CURRENT_REQUEST_MANAGER, POST_MANAGER_RESPONSE_PENDING, POST_MANAGER_RESPONSE_FULFILLED,
         POST_MANAGER_RESPONSE_REJECTED, POST_MARK_COMMENT_READ_PENDING, POST_MARK_COMMENT_READ_FULFILLED,
         POST_MARK_COMMENT_READ_REJECTED, POST_REQUEST_MANAGER_RESPONSE_PENDING, POST_REQUEST_MANAGER_RESPONSE_FULFILLED,
         POST_REQUEST_MANAGER_RESPONSE_REJECTED, POST_MARK_REQUEST_READ_PENDING, POST_MARK_REQUEST_READ_FULFILLED,
         POST_MARK_REQUEST_READ_REJECTED, POST_CHANGE_BUDGET_PENDING, POST_CHANGE_BUDGET_FULFILLED, 
         POST_CHANGE_BUDGET_REJECTED } from './../actions/types';

const initialState = {
    current_capability: {},
    is_set: false,
    current_category_index: 0,
    is_set_current_category: false,
    current_request_index: 0,
    posting_manager_response: false,
    posted_manager_response: false,
    posting_request_manager_response: false,
    posted_request_manager_response: false
};

export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_CURRENT_CAPABILITY:
            return {
                    ...state,
                    current_capability: action.payload,
                    is_set: true,
                    is_set_current_category: false,
                    current_request_index: 0
            };
        case GET_CURRENT_CAPABILITY:
            return {
                ...state,
                is_set: true,
                current_category_index: {}
            };
        case SET_CURRENT_CATEGORY_MANAGER:
            return {
                ...state,
                current_category_index: action.payload,
                is_set_current_category: true,
                current_request_index: 0
            };
        case SET_CURRENT_REQUEST_MANAGER:
            return {
                ...state,
                current_request_index: action.payload
            };
        case POST_REQUEST_MANAGER_RESPONSE_PENDING:
            return {
                ...state,
                posting_request_manager_response: true
            }
        case POST_REQUEST_MANAGER_RESPONSE_FULFILLED:
            var categoryUpdated=state.current_capability.categories; 
            categoryUpdated[state.current_category_index].requests[state.current_request_index].managerResponse=action.payload;
            categoryUpdated[state.current_category_index].requests.reverse();
            var newnew = categoryUpdated;
            return {
                ...state,
                posting_request_manager_response: false,
                posted_request_manager_response: true,
                current_capability: {...state.current_capability, categories: newnew}
            }
        case POST_REQUEST_MANAGER_RESPONSE_REJECTED:
            return {
                ...state,
                posting_request_manager_response: false,
                error: action.payload
            };
        case POST_MANAGER_RESPONSE_PENDING:
            return {
                ...state,
                posting_manager_response: true
            }
        case POST_MANAGER_RESPONSE_FULFILLED:
            var categoryUpdated=state.current_capability.categories;
            categoryUpdated[state.current_category_index].requests[state.current_request_index].comments[action.payload.index_comment].managerResponse=action.payload.managerResponse;
            categoryUpdated[state.current_category_index].requests.reverse();
            var newnew = categoryUpdated;
            return {
                ...state,
                posting_manager_response: false,
                posted_manager_response: true,
                current_capability: {...state.current_capability, categories: newnew}
            }
        case POST_MANAGER_RESPONSE_REJECTED:
            return {
                ...state,
                posting_manager_response: false,
                error: action.payload
            };
        case POST_MARK_COMMENT_READ_PENDING:
            return {
                ...state
            }
        case POST_MARK_COMMENT_READ_FULFILLED:
            var categoryUpdated=state.current_capability.categories[state.current_category_index];
            
            for(let i=0; i<categoryUpdated.requests[state.current_request_index].comments.length; i++)
                {
                    categoryUpdated.requests[state.current_request_index].comments[i].messageRead="true"
                }
            return {
                ...state,
                //*** */ current_capability: {...state.current_capability, categoryUpdated: categoryUpdated}
            }
        case POST_MARK_COMMENT_READ_REJECTED:
            return {
                ...state,
                error: action.payload
            }
        case POST_MARK_REQUEST_READ_PENDING:
            return {
                ...state
            }
        case POST_MARK_REQUEST_READ_FULFILLED:
            var categoryUpdated=state.current_capability.categories[state.current_category_index];
            categoryUpdated.requests[state.current_request_index].requestRead="true"
            return {
                ...state,
                // *** */ current_capability: {...state.current_capability, categoryUpdated: categoryUpdated}
            }
        case POST_MARK_REQUEST_READ_REJECTED:
            return {
                ...state,
                error: action.payload
            }
        case POST_CHANGE_BUDGET_PENDING:
            return {
                ...state
            }
        case POST_CHANGE_BUDGET_FULFILLED:
            var categoryUpdated=state.current_capability.categories;
            categoryUpdated[state.current_category_index].budget=action.payload
            return {
                ...state,
                current_capability: {...state.current_capability, current_capability: categoryUpdated}
            }
        case POST_CHANGE_BUDGET_REJECTED:
            return {
                ...state,
                error: action.payload
            }
        default: 
            return state;
    }
}
import axios from 'axios';
import { SET_CURRENT_CAPABILITY, GET_CURRENT_CAPABILITY, SET_CURRENT_CATEGORY_MANAGER,
         SET_CURRENT_REQUEST_MANAGER, POST_MANAGER_RESPONSE_PENDING, POST_MANAGER_RESPONSE_FULFILLED,
         POST_MANAGER_RESPONSE_REJECTED, POST_MARK_COMMENT_READ_PENDING, POST_MARK_COMMENT_READ_FULFILLED,
         POST_MARK_COMMENT_READ_REJECTED, POST_REQUEST_MANAGER_RESPONSE_PENDING, POST_REQUEST_MANAGER_RESPONSE_FULFILLED,
         POST_REQUEST_MANAGER_RESPONSE_REJECTED, POST_MARK_REQUEST_READ_PENDING, POST_MARK_REQUEST_READ_FULFILLED,
         POST_MARK_REQUEST_READ_REJECTED, POST_CHANGE_BUDGET_PENDING, POST_CHANGE_BUDGET_FULFILLED, 
         POST_CHANGE_BUDGET_REJECTED } from './types';


export const setCurrentCapability = (capability) =>  dispatch => {

    dispatch({
        type: SET_CURRENT_CAPABILITY,
        payload: capability
    });

}

export const getCurrentCapability = () =>  dispatch => {

    dispatch({
        type: GET_CURRENT_CAPABILITY
    });

} 

export const setCurrentCategory = (category_index) =>  dispatch => {

    dispatch({
        type: SET_CURRENT_CATEGORY_MANAGER,
        payload: category_index
    });
}

export const setCurrentRequest = (request_index) =>  dispatch => {

    dispatch({
        type: SET_CURRENT_REQUEST_MANAGER,
        payload: request_index
    });
}

export const postRequestManagerResponse = (managerResponse, _id_capabilitate, _id_categorie, _id_request, userName) =>  dispatch => {

    dispatch({
      type: POST_REQUEST_MANAGER_RESPONSE_PENDING
    });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_management_response_for_request', {"managerResponse": managerResponse, "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie, "_id_request": _id_request, "userName": userName},{ 'headers': { 'Authorization': token } })
            .then(res => {
                managerResponse._id=  res.data._id_comment
               
                dispatch({ type: POST_REQUEST_MANAGER_RESPONSE_FULFILLED,
                           payload: managerResponse });
            })
            .catch(err => {
                dispatch({ type: POST_REQUEST_MANAGER_RESPONSE_REJECTED,
                           payload: err});
            });
           
}


export const postManagerResponse = (managerResponse, _id_capabilitate, _id_categorie, _id_request, _id_comment, index_comment, userName) =>  dispatch => {

    dispatch({
      type: POST_MANAGER_RESPONSE_PENDING
    });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_comment_management_response', {"managerResponse": managerResponse, "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie, "_id_request": _id_request, "_id_comment": _id_comment, "userName": userName},{ 'headers': { 'Authorization': token } })
            .then(res => {
                managerResponse._id=  res.data._id_comment
               
                dispatch({ type: POST_MANAGER_RESPONSE_FULFILLED,
                           payload:  {"managerResponse":managerResponse,
                                      "index_comment": index_comment} });
            })
            .catch(err => {
                dispatch({ type: POST_MANAGER_RESPONSE_REJECTED,
                           payload: err});
            });
           
}

export const postMarkRequestAsRead = ( _id_capabilitate, _id_categorie, _id_request) =>  dispatch => {

    dispatch({
      type: POST_MARK_REQUEST_READ_PENDING
    });

    console.log(_id_capabilitate, _id_categorie, _id_request)

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_mark_request_as_read', { "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie, "_id_request": _id_request},{ 'headers': { 'Authorization': token } })
            .then(res => {       
                dispatch({ type: POST_MARK_REQUEST_READ_FULFILLED });

            })
            .catch(err => {
                dispatch({ type: POST_MARK_REQUEST_READ_REJECTED,
                           payload: err});
            });
           
}

export const postMarkCommentsAsRead = ( _id_capabilitate, _id_categorie, _id_request) =>  dispatch => {

    dispatch({
      type: POST_MARK_COMMENT_READ_PENDING
    });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_mark_comments_as_read', { "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie, "_id_request": _id_request},{ 'headers': { 'Authorization': token } })
            .then(res => {       
                dispatch({ type: POST_MARK_COMMENT_READ_FULFILLED });

            })
            .catch(err => {
                dispatch({ type: POST_MARK_COMMENT_READ_REJECTED,
                           payload: err});
            });
           
}

export const postChangeBudget = ( _id_capabilitate, _id_categorie, new_budget) =>  dispatch => {

    dispatch({
      type: POST_CHANGE_BUDGET_PENDING
    });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_change_category_budget', { "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie, "new_budget": new_budget},{ 'headers': { 'Authorization': token } })
            .then(res => {       
                dispatch({ type: POST_CHANGE_BUDGET_FULFILLED,
                           payload: new_budget });

            })
            .catch(err => {
                dispatch({ type: POST_CHANGE_BUDGET_REJECTED,
                           payload: err});
            });
}

export const getAllUnreadComments = (requests) => {
    let unreadRequests = 0;
    let unreadComments = 0;

    requests.forEach(request => {
        if(!request.requestRead){
            unreadRequests++;
        }
        for(let i=0;i<request.comments.length;i++){
            if(!request.comments[i].messageRead)
            unreadComments++;
        }    
    });
    
    return {unreadRequests: unreadRequests, unreadComments: unreadComments};
}
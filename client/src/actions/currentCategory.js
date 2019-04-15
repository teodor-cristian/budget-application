import { SET_CURRENT_CATEGORY, GET_CURRENT_CATEGORY, ADD_NEW_REQUEST,
         POST_NEW_REQUEST_PENDING, POST_NEW_REQUEST_FULFILLED, POST_NEW_REQUEST_REJECTED,
         POST_NEW_COMMENT_PENDING, POST_NEW_COMMENT_FULFILLED, POST_NEW_COMMENT_REJECTED,
         POST_NEW_EXPENSE_PENDING, POST_NEW_EXPENSE_FULFILLED, POST_NEW_EXPENSE_REJECTED,
         FILTER_REQUESTS   } from './types';
import axios from 'axios';
import {removePermissionFromUser} from './authentication';
import {postSecondExpense} from './capabilities'
import store from 'create-react-app/my-app/client/src/store';

export const getCurrentCategory = () =>  dispatch => {

    dispatch({
        type: GET_CURRENT_CATEGORY,
    });

}

export const setCurrentCategory = (_id_capabilitate,category) => dispatch => {
    dispatch({
        type: SET_CURRENT_CATEGORY,
        payload: {"_id_capabilitate": _id_capabilitate,"category":category}
    })
}

export const postNewRequest = (newRequest, _id_capabilitate, _id_categorie) =>  dispatch => {

      dispatch({
        type: POST_NEW_REQUEST_PENDING
      });

      const token='Bearer '+ localStorage.jwtToken;
      
      axios.post('/api/capabilities/post_new_request', {"new_request": newRequest, "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie},{ 'headers': { 'Authorization': token } })
              .then(res => {
                  newRequest._id=  res.data._id_request
                 
                  dispatch({ type: POST_NEW_REQUEST_FULFILLED,
                             payload: newRequest});
                  console.log(res);
              })
              .catch(err => {
                  dispatch({ type: POST_NEW_REQUEST_REJECTED,
                             payload: err});
              });
}

export const postNewComment = (newComment, _id_capabilitate, _id_categorie, _id_request, request_index) =>  dispatch => {

    dispatch({
      type: POST_NEW_COMMENT_PENDING
    });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_comment', {"newComment": newComment, "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie, "_id_request": _id_request},{ 'headers': { 'Authorization': token } })
            .then(res => {
                newComment._id=  res.data._id_comment
               
                dispatch({ type: POST_NEW_COMMENT_FULFILLED,
                           payload: {"request_index":request_index, "newComment": newComment}});
            })
            .catch(err => {
                dispatch({ type: POST_NEW_COMMENT_REJECTED,
                           payload: err});
            });
           
}

export const postNewExpense = (newExpense, _id_capabilitate, _id_categorie) =>  dispatch => {

    dispatch({
      type: POST_NEW_EXPENSE_PENDING
    });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/capabilities/post_expense_as_user', {"newExpense": newExpense, "_id_capabilitate": _id_capabilitate, "_id_categorie": _id_categorie},{ 'headers': { 'Authorization': token } })
            .then(res => {
                newExpense._id=  res.data._id_expense
               
                if(_id_categorie == store.getState().currentCategory.current_category._id){
                    dispatch({ type: POST_NEW_EXPENSE_FULFILLED,
                        payload: newExpense});
                    dispatch(removePermissionFromUser(_id_categorie))
                }
                else{
                    dispatch(postSecondExpense(newExpense, _id_capabilitate, _id_categorie));
                }
                
            })
            .catch(err => {
                dispatch({ type: POST_NEW_EXPENSE_REJECTED,
                           payload: err});
            });
           
}

export const filterRequests = (filteredRequests) =>  dispatch => {

    dispatch({ type: FILTER_REQUESTS,
        payload: filteredRequests});
           
}
import axios from 'axios';
import { FETCH_ALL_MANAGERS_PENDING, FETCH_ALL_MANAGERS_FULFILLED, FETCH_ALL_MANAGERS_REJECTED,
         POST_CAPABILITY_REQUEST_PENDING, POST_CAPABILITY_REQUEST_FULFILLED, 
         POST_CAPABILITY_REQUEST_REJECTED } from '../actions/types';



export const getAllManagers = () =>  dispatch => {

    dispatch({ type: FETCH_ALL_MANAGERS_PENDING });

    const token='Bearer '+ localStorage.jwtToken;

    axios.get('/api/users/get_all_managers',{ 'headers': { 'Authorization': token } })
            .then(res => {
                const users = res.data.userMap;
                dispatch({ type: FETCH_ALL_MANAGERS_FULFILLED,
                           payload: users });

            })
            .catch(err => {
                dispatch({ type: FETCH_ALL_MANAGERS_REJECTED, 
                           payload: err});
            });
}

export const sendCapabilityRequest = (_id_manager) =>  dispatch => {

    dispatch({ type: POST_CAPABILITY_REQUEST_PENDING });

    const token='Bearer '+ localStorage.jwtToken;

    axios.post('/api/users/send_capability_request', {_id_manager: _id_manager},{ 'headers': { 'Authorization': token } })
            .then(res => {
                dispatch({ type: POST_CAPABILITY_REQUEST_FULFILLED });

            })
            .catch(err => {
                dispatch({ type: POST_CAPABILITY_REQUEST_REJECTED, 
                           payload: err});
            });
}
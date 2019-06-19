import axios from 'axios';
import { FETCH_ALL_USERS_PENDING, FETCH_ALL_USERS_FULFILLED, FETCH_ALL_USERS_REJECTED,
         ADD_USER_TO_CAPABILITY_PENDING, ADD_USER_TO_CAPABILITY_FULFILLED, ADD_USER_TO_CAPABILITY_REJECTED,
         DELETE_USER_TO_CAPABILITY_PENDING, DELETE_USER_TO_CAPABILITY_FULFILLED, DELETE_USER_TO_CAPABILITY_REJECTED } from '../actions/types';



export const getAllUsers = () =>  dispatch => {

    dispatch({ type: FETCH_ALL_USERS_PENDING });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.get('/api/users/get_all_users',{ 'headers': { 'Authorization': token } })
            .then(res => {
                const users = res.data.userMap;
                dispatch({ type: FETCH_ALL_USERS_FULFILLED,
                           payload: users });

            })
            .catch(err => {
                dispatch({ type: FETCH_ALL_USERS_REJECTED, 
                           payload: err});
            });
}

export const addUserToCapability = (id_user, capability_id, capability_name) =>  dispatch => {

    dispatch({ type: ADD_USER_TO_CAPABILITY_PENDING });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/users/update_user_capability', {'id_user': id_user, 'capability_id': capability_id, 'capability_name': capability_name},{'headers': { 'Authorization': token } })
            .then(res => {
                const users = res.data.userMap;
                dispatch({ type: ADD_USER_TO_CAPABILITY_FULFILLED,
                           payload: {'id_user': id_user, 'capability_id': capability_id} });

            })
            .catch(err => {
                dispatch({ type: ADD_USER_TO_CAPABILITY_REJECTED, 
                           payload: err});
            });
}


export const deleteUserFromCapability = (id_user, capability_id) =>  dispatch => {

    dispatch({ type: DELETE_USER_TO_CAPABILITY_PENDING });

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.post('/api/users/update_user_delete_capability', {'id_user': id_user, 'capability_id': capability_id},{'headers': { 'Authorization': token } })
            .then(res => {
                const users = res.data.userMap;
                dispatch({ type: DELETE_USER_TO_CAPABILITY_FULFILLED,
                           payload: {'id_user': id_user, 'capability_id': capability_id} });

            })
            .catch(err => {
                dispatch({ type: DELETE_USER_TO_CAPABILITY_REJECTED, 
                           payload: err});
            });
}
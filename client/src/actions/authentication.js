import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER, REMOVE_PERMISSION_FROM_USER, LOGOUT_USER } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';


export const loginUser = (user) => dispatch => {
    axios.post('/api/users/login', user)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch(setCurrentUser(decoded));

            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}

export const loginUserWithIdam = (userEmail) => dispatch => {
    axios.post('/api/users/loginWithIdam', {userEmail: userEmail})
    .then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));

    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        });
    });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }

}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    dispatch({ type: LOGOUT_USER })
    // history.push('/login');
    history.push('/idam-login');
}

export const removePermissionFromUser = (_id_categorie) => dispatch => {
    dispatch({
        type: REMOVE_PERMISSION_FROM_USER,
        payload: _id_categorie
    });
}
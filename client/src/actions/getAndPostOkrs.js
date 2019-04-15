import axios from 'axios';
// import { GET_ERRORS, SET_CURRENT_USER  } from './types';
// import setAuthToken from '../setAuthToken';
// import jwt_decode from 'jwt-decode';


export const getAllOkrs = () =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.get('/api/okrs/okr_list',{ 'headers': { 'Authorization': token } })
            .then(res => {
                const okrs = res.data.okrs;
                console.log(okrs);
                return okrs;
            })
            .catch(err => {
                console.log(err.response.data)
            });
}

export const addOkr = (newOkr) =>  {
    const token='Bearer '+ localStorage.jwtToken;
    axios.post('/api/okrs/add_okr', newOkr, { 'headers': { 'Authorization': token } })
            .then(res => {
                console.log("S-a adaugat un nou okr");
            })
            .catch(err => {
                console.log(err.response.data)
            });
}
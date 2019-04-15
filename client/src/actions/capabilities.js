import axios from 'axios';
import store from '../store';
import { FETCH_CAPABILITIES_PENDING, FETCH_CAPABILITIES_FULFILLED, FETCH_CAPABILITIES_REJECTED,
         GET_ALL_CATEGORIES, POST_EXPENSE_SECOND_CATEGORY } from './types';


export const getAllCapabilities = () =>  dispatch => {

    dispatch(startFetching());

    const token='Bearer '+ localStorage.jwtToken;
    
    axios.get('/api/capabilities/get_all_capabilities',{ 'headers': { 'Authorization': token } })
            .then(res => {
                const capabilities = res.data.capabilities;
                dispatch(fetchingCurrentCapabilities(capabilities));

            })
            .catch(err => {
                dispatch(errorfetchingCurrentCapabilities(err));
            });
}

export const startFetching = () =>{
    return {
        type: FETCH_CAPABILITIES_PENDING
    }
}

export const fetchingCurrentCapabilities = capabilities => {
    return {
        type: FETCH_CAPABILITIES_FULFILLED,
        payload: capabilities
    }
}

export const errorfetchingCurrentCapabilities = err => {
    return {
        type: FETCH_CAPABILITIES_REJECTED,
        payload: err
    }
}

export const getAllCategories  = (_id_capabilitate, _id_category) =>  dispatch => {
    var capabilities = store.getState().capabilities.capabilities;

    var availableCategories = [];
    for(let i=0; i<capabilities.length; i++){
        if(capabilities[i]._id == _id_capabilitate){
            for(let j=0; j<capabilities[i].categories.length; j++){
                if(capabilities[i].categories[j]._id != _id_category){
                    availableCategories.push({
                        // '_id_capabilitate': _id_capabilitate,
                        '_id_category': capabilities[i].categories[j]._id,
                        'category_name': capabilities[i].categories[j].name
                    })
                }
            }
        }
    }
    return availableCategories;
}

export const postSecondExpense = (newExpense, _id_capabilitate,_id_categorie) =>  dispatch => {
    var capabilities = store.getState().capabilities.capabilities;

    var index_capabilitate=0;
    var index_categorie=0;
    for(let i=0; i<capabilities.length; i++){
        if(capabilities[i]._id == _id_capabilitate){
            index_capabilitate=i;
            for(let j=0; j<capabilities[i].categories.length; j++){
                if(capabilities[i].categories[j]._id == _id_categorie){
                    index_categorie=j;
                }
            }
        }
    }

    dispatch({ type: POST_EXPENSE_SECOND_CATEGORY,
               payload: {
                   newExpense: newExpense,
                   index_capabilitate: index_capabilitate,
                   index_categorie: index_categorie
                }});
    
}
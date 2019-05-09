import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import capabilitiesReducer from './capabilitiesReducer';
import currentCategoryReducer from './currentCategoryReducer';
import currentCapabilityManagerReducer from './currentCapabilityManagerReducer';
import allUsersReducer from './allUsersReducer';
import allManagersReducer from './allManagersReducer';

// export default combineReducers({
//     errors: errorReducer,
//     auth: authReducer,
//     capabilities: capabilitiesReducer,
//     currentCategory: currentCategoryReducer,
//     currentCapabilityManager: currentCapabilityManagerReducer
// });

const appReducer = combineReducers({
    errors: errorReducer,
    auth: authReducer,
    capabilities: capabilitiesReducer,
    currentCategory: currentCategoryReducer,
    currentCapabilityManager: currentCapabilityManagerReducer,
    allUsers: allUsersReducer,
    allManagers: allManagersReducer
  })
  
  const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_USER') {
      state = undefined
    }
  
    return appReducer(state, action)
  }

  export default rootReducer;